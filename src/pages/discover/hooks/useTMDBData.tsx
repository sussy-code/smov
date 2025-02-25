import { useCallback, useEffect, useState } from "react";

import { get } from "@/backend/metadata/tmdb";
import { Category, Genre, Movie, TVShow } from "@/pages/discover/common";
import { conf } from "@/setup/config";

type MediaType = "movie" | "tv";

export function useTMDBData(
  genres: Genre[],
  categories: Category[],
  mediaType: MediaType,
) {
  const [genreMedia, setGenreMedia] = useState<{
    [id: number]: Movie[] | TVShow[];
  }>({});
  const [categoryMedia, setCategoryMedia] = useState<{
    [categoryName: string]: Movie[] | TVShow[];
  }>({});

  // Unified fetch function
  const fetchMedia = useCallback(
    async (endpoint: string, key: string, isGenre: boolean) => {
      try {
        const media: Movie[] | TVShow[] = [];
        for (let page = 1; page <= 6; page += 1) {
          const data = await get<any>(endpoint, {
            api_key: conf().TMDB_READ_API_KEY,
            language: "en-US",
            page: page.toString(),
            ...(isGenre ? { with_genres: key } : {}),
          });
          media.push(...data.results);
        }

        // Shuffle the media
        for (let i = media.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [media[i], media[j]] = [media[j], media[i]];
        }

        return media;
      } catch (error) {
        console.error(
          `Error fetching ${mediaType} for ${isGenre ? "genre" : "category"} ${key}:`,
          error,
        );
        return [];
      }
    },
    [mediaType],
  );

  // Fetch media for each genre
  useEffect(() => {
    const fetchMediaForGenres = async () => {
      const genrePromises = genres.map(async (genre) => {
        const media = await fetchMedia(
          `/discover/${mediaType}`,
          genre.id.toString(),
          true,
        );
        setGenreMedia((prev) => ({ ...prev, [genre.id]: media }));
      });
      await Promise.all(genrePromises);
    };

    fetchMediaForGenres();
  }, [genres, mediaType, fetchMedia]);

  // Fetch media for each category
  useEffect(() => {
    const fetchMediaForCategories = async () => {
      const categoryPromises = categories.map(async (category) => {
        const media = await fetchMedia(category.endpoint, category.name, false);
        setCategoryMedia((prev) => ({ ...prev, [category.name]: media }));
      });
      await Promise.all(categoryPromises);
    };

    fetchMediaForCategories();
  }, [categories, mediaType, fetchMedia]);

  return { genreMedia, categoryMedia };
}
