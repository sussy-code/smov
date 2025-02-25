import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { get } from "@/backend/metadata/tmdb";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  Genre,
  Movie,
  categories,
  tvCategories,
} from "@/pages/discover/common";
import { conf } from "@/setup/config";

import "./discover.css";
import { CategoryButtons } from "./components/CategoryButtons";
import { MediaCarousel } from "./components/MediaCarousel";
import { RandomMovieButton } from "./components/RandomMovieButton";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { useTMDBData } from "./hooks/useTMDBData";

const MOVIE_PROVIDERS = [
  { name: "Netflix", id: "8" },
  { name: "Apple TV+", id: "2" },
  { name: "Amazon Prime Video", id: "10" },
  { name: "Hulu", id: "15" },
  { name: "Max", id: "1899" },
  { name: "Paramount Plus", id: "531" },
  { name: "Disney Plus", id: "337" },
  { name: "Shudder", id: "99" },
];

const TV_PROVIDERS = [
  { name: "Netflix", id: "8" },
  { name: "Apple TV+", id: "350" },
  { name: "Paramount Plus", id: "531" },
  { name: "Hulu", id: "15" },
  { name: "Max", id: "1899" },
  { name: "Disney Plus", id: "337" },
  { name: "fubuTV", id: "257" },
];

export function DiscoverContent() {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("movies");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownTimeout, setCountdownTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [selectedProvider, setSelectedProvider] = useState({
    name: "",
    id: "",
  });
  const [movieWidth, setMovieWidth] = useState(
    window.innerWidth < 600 ? "150px" : "200px",
  );
  const [providerMovies, setProviderMovies] = useState<Movie[]>([]);
  const [providerTVShows, setProviderTVShows] = useState<any[]>([]);

  // Refs
  const carouselRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Hooks
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();
  const { genreMedia: genreMovies, categoryMedia: categoryMovies } =
    useTMDBData(genres, categories, "movie");
  const { genreMedia: genreTVShows, categoryMedia: categoryTVShows } =
    useTMDBData(tvGenres, tvCategories, "tv");

  // Fetch TV show genres
  useEffect(() => {
    const fetchTVGenres = async () => {
      try {
        const data = await get<any>("/genre/tv/list", {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });
        // Fetch only the first 10 TV show genres
        setTVGenres(data.genres.slice(0, 10));
      } catch (error) {
        console.error("Error fetching TV show genres:", error);
      }
    };

    fetchTVGenres();
  }, []);

  // Fetch Movie genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await get<any>("/genre/movie/list", {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });

        // Fetch only the first 12 genres
        setGenres(data.genres.slice(0, 12));
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setMovieWidth(window.innerWidth < 600 ? "150px" : "200px");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : prev));
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [countdown]);

  // Handlers
  const handleCategoryChange = (
    eventOrValue: React.ChangeEvent<HTMLSelectElement> | string,
  ) => {
    const value =
      typeof eventOrValue === "string"
        ? eventOrValue
        : eventOrValue.target.value;
    setSelectedCategory(value);
  };

  const handleRandomMovieClick = () => {
    const allMovies = Object.values(genreMovies).flat();
    const uniqueTitles = new Set(allMovies.map((movie) => movie.title));
    const uniqueTitlesArray = Array.from(uniqueTitles);
    const randomIndex = Math.floor(Math.random() * uniqueTitlesArray.length);
    const selectedMovie = allMovies.find(
      (movie) => movie.title === uniqueTitlesArray[randomIndex],
    );

    if (selectedMovie) {
      if (countdown !== null && countdown > 0) {
        setCountdown(null);
        if (countdownTimeout) {
          clearTimeout(countdownTimeout);
          setCountdownTimeout(null);
          setRandomMovie(null);
        }
      } else {
        setRandomMovie(selectedMovie as Movie);
        setCountdown(5);
        const timeoutId = setTimeout(() => {
          navigate(`/media/tmdb-movie-${selectedMovie.id}-discover-random`);
        }, 5000);
        setCountdownTimeout(timeoutId);
      }
    }
  };

  const handleProviderClick = async (id: string, name: string) => {
    try {
      setSelectedProvider({ name, id });
      const endpoint =
        selectedCategory === "movies" ? "/discover/movie" : "/discover/tv";
      const setData =
        selectedCategory === "movies" ? setProviderMovies : setProviderTVShows;
      const data = await get<any>(endpoint, {
        api_key: conf().TMDB_READ_API_KEY,
        with_watch_providers: id,
        watch_region: "US",
        language: "en-US",
      });
      setData(data.results);
    } catch (error) {
      console.error("Error fetching provider movies/shows:", error);
    }
  };

  return (
    <div>
      {/* Random Movie Button */}
      <RandomMovieButton
        countdown={countdown}
        onClick={handleRandomMovieClick}
        randomMovieTitle={randomMovie ? randomMovie.title : null}
      />

      {/* Category Tabs */}
      <div className="mt-8 p-4 w-full max-w-screen-xl mx-auto">
        <div className="relative flex justify-center mb-4">
          <div className="flex space-x-4">
            {["movies", "tvshows"].map((category) => (
              <button
                key={category}
                type="button"
                className={`text-2xl font-bold p-2 bg-transparent text-center rounded-full cursor-pointer flex items-center transition-transform duration-200 ${
                  selectedCategory === category
                    ? "transform scale-105 text-type-link"
                    : "text-type-secondary"
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category === "movies" ? "Movies" : "TV Shows"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center overflow-x-auto">
          <CategoryButtons
            categories={
              selectedCategory === "movies" ? MOVIE_PROVIDERS : TV_PROVIDERS
            }
            onCategoryClick={handleProviderClick}
            categoryType="providers"
            isMobile={isMobile}
            showAlwaysScroll={false}
          />
        </div>
        <div className="flex overflow-x-auto">
          <CategoryButtons
            categories={
              selectedCategory === "movies"
                ? [...categories, ...genres]
                : [...tvCategories, ...tvGenres]
            }
            onCategoryClick={(id, name) => {
              const element = document.getElementById(
                `carousel-${name.toLowerCase().replace(/ /g, "-")}`,
              );
              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "center",
                });
              }
            }}
            categoryType="movies"
            isMobile={isMobile}
            showAlwaysScroll
          />
        </div>
      </div>
      {/* Content Section */}
      <div className="w-full md:w-[90%] max-w-[2400px] mx-auto">
        {(() => {
          const isMovieCategory = selectedCategory === "movies";
          const providerMedia = isMovieCategory
            ? providerMovies
            : providerTVShows;
          const mediaGenres = isMovieCategory ? genres : tvGenres;
          const mediaCategories = isMovieCategory ? categories : tvCategories;

          return (
            <>
              {/* Media Carousels */}
              {providerMedia.length > 0 && (
                <MediaCarousel
                  medias={providerMedia}
                  category={selectedProvider.name}
                  isTVShow={!isMovieCategory}
                  movieWidth={movieWidth}
                  isMobile={isMobile}
                  carouselRefs={carouselRefs}
                />
              )}
              {/* Categories and Genres */}
              {mediaCategories.map((category) => (
                <MediaCarousel
                  key={category.name}
                  medias={
                    isMovieCategory
                      ? categoryMovies[category.name] || []
                      : categoryTVShows[category.name] || []
                  }
                  category={category.name}
                  isTVShow={!isMovieCategory}
                  movieWidth={movieWidth}
                  isMobile={isMobile}
                  carouselRefs={carouselRefs}
                />
              ))}
              {mediaGenres.map((genre) => (
                <MediaCarousel
                  key={genre.id}
                  medias={
                    isMovieCategory
                      ? genreMovies[genre.id] || []
                      : genreTVShows[genre.id] || []
                  }
                  category={genre.name}
                  isTVShow={!isMovieCategory}
                  movieWidth={movieWidth}
                  isMobile={isMobile}
                  carouselRefs={carouselRefs}
                />
              ))}
            </>
          );
        })()}
      </div>

      <ScrollToTopButton />
    </div>
  );
}

export default DiscoverContent;
