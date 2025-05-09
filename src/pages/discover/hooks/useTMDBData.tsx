import { useCallback, useEffect, useState } from "react";

import { get } from "@/backend/metadata/tmdb";
import { Category, Genre, Movie, TVShow } from "@/pages/discover/common";
import { conf } from "@/setup/config";

type MediaType = "movie" | "tv";

export function useTMDBData(
  genres: Genre[],
  categories: Category[],
  mediaType: MediaType,
  shouldLoad = true,
) {
  const [genreMedia, setGenreMedia] = useState<{
    [id: number]: Movie[] | TVShow[];
  }>({});
  const [categoryMedia, setCategoryMedia] = useState<{
    [categoryName: string]: Movie[] | TVShow[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Unified fetch function
  const fetchMedia = useCallback(
    async (endpoint: string, key: string, isGenre: boolean) => {
      try {
        const media: Movie[] | TVShow[] = [];
        // Reduce the number of pages to improve performance
        for (let page = 1; page <= 2; page += 1) {
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
    if (!shouldLoad || genres.length === 0) return;

    const fetchMediaForGenres = async () => {
      setIsLoading(true);
      const genrePromises = genres.map(async (genre) => {
        const media = await fetchMedia(
          `/discover/${mediaType}`,
          genre.id.toString(),
          true,
        );
        setGenreMedia((prev) => ({ ...prev, [genre.id]: media }));
      });
      await Promise.all(genrePromises);
      setIsLoading(false);
    };

    fetchMediaForGenres();
  }, [genres, mediaType, fetchMedia, shouldLoad]);

  // Fetch media for each category
  useEffect(() => {
    if (!shouldLoad || categories.length === 0) return;

    const fetchMediaForCategories = async () => {
      setIsLoading(true);
      const categoryPromises = categories.map(async (category) => {
        const media = await fetchMedia(category.endpoint, category.name, false);
        setCategoryMedia((prev) => ({ ...prev, [category.name]: media }));
      });
      await Promise.all(categoryPromises);
      setIsLoading(false);
    };

    fetchMediaForCategories();
  }, [categories, mediaType, fetchMedia, shouldLoad]);

  return { genreMedia, categoryMedia, isLoading };
}

// Create a hook for lazy loading a specific genre or category
export function useLazyTMDBData(
  genre: Genre | null,
  category: Category | null,
  mediaType: MediaType,
  shouldLoad = false,
) {
  const [media, setMedia] = useState<Movie[] | TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMedia = useCallback(
    async (endpoint: string, key: string, isGenre: boolean) => {
      try {
        setIsLoading(true);
        const mediaItems: Movie[] | TVShow[] = [];
        // Only fetch one page for better performance
        const data = await get<any>(endpoint, {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
          page: "1",
          ...(isGenre ? { with_genres: key } : {}),
        });
        mediaItems.push(...data.results);
        setMedia(mediaItems);
        setIsLoading(false);
        return mediaItems;
      } catch (error) {
        console.error(
          `Error fetching ${mediaType} for ${isGenre ? "genre" : "category"}:`,
          error,
        );
        setIsLoading(false);
        return [];
      }
    },
    [mediaType],
  );

  useEffect(() => {
    if (!shouldLoad) return;

    if (genre) {
      fetchMedia(`/discover/${mediaType}`, genre.id.toString(), true);
    } else if (category) {
      fetchMedia(category.endpoint, category.name, false);
    }
  }, [genre, category, mediaType, fetchMedia, shouldLoad]);

  return { media, isLoading };
}
