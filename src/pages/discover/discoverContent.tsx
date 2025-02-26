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
import { LazyMediaCarousel } from "./components/LazyMediaCarousel";
import { LazyTabContent } from "./components/LazyTabContent";
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
  const [providerMovies, setProviderMovies] = useState<Movie[]>([]);
  const [providerTVShows, setProviderTVShows] = useState<any[]>([]);

  // Refs
  const carouselRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Hooks
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();
  const { genreMedia: genreMovies } = useTMDBData(genres, categories, "movie");
  // const { genreMedia: genreTVShows } = useTMDBData(
  //   tvGenres,
  //   tvCategories,
  //   "tv",
  // );

  // Only load data for the active tab
  const isMoviesTab = selectedCategory === "movies";
  const isTVShowsTab = selectedCategory === "tvshows";

  // Fetch TV show genres
  useEffect(() => {
    if (!isTVShowsTab) return;

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
  }, [isTVShowsTab]);

  // Fetch Movie genres
  useEffect(() => {
    if (!isMoviesTab) return;

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
  }, [isMoviesTab]);

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

  // Render Movies content with lazy loading
  const renderMoviesContent = () => {
    return (
      <>
        {/* Provider Movies */}
        {providerMovies.length > 0 && (
          <MediaCarousel
            medias={providerMovies}
            category={selectedProvider.name}
            isTVShow={false}
            isMobile={isMobile}
            carouselRefs={carouselRefs}
          />
        )}

        {/* Categories */}
        {categories.map((category) => (
          <LazyMediaCarousel
            key={category.name}
            category={category}
            mediaType="movie"
            isMobile={isMobile}
            carouselRefs={carouselRefs}
          />
        ))}

        {/* Genres */}
        {genres.map((genre) => (
          <LazyMediaCarousel
            key={genre.id}
            genre={genre}
            mediaType="movie"
            isMobile={isMobile}
            carouselRefs={carouselRefs}
          />
        ))}
      </>
    );
  };

  // Render TV Shows content with lazy loading
  const renderTVShowsContent = () => {
    return (
      <>
        {/* Provider TV Shows */}
        {providerTVShows.length > 0 && (
          <MediaCarousel
            medias={providerTVShows}
            category={selectedProvider.name}
            isTVShow
            isMobile={isMobile}
            carouselRefs={carouselRefs}
          />
        )}

        {/* Categories */}
        {tvCategories.map((category) => (
          <LazyMediaCarousel
            key={category.name}
            category={category}
            mediaType="tv"
            isMobile={isMobile}
            carouselRefs={carouselRefs}
          />
        ))}

        {/* Genres */}
        {tvGenres.map((genre) => (
          <LazyMediaCarousel
            key={genre.id}
            genre={genre}
            mediaType="tv"
            isMobile={isMobile}
            carouselRefs={carouselRefs}
          />
        ))}
      </>
    );
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

      {/* Content Section with Lazy Loading Tabs */}
      <div className="w-full md:w-[90%] max-w-[2400px] mx-auto">
        {/* Movies Tab */}
        <LazyTabContent isActive={isMoviesTab}>
          {renderMoviesContent()}
        </LazyTabContent>

        {/* TV Shows Tab */}
        <LazyTabContent isActive={isTVShowsTab}>
          {renderTVShowsContent()}
        </LazyTabContent>
      </div>

      <ScrollToTopButton />
    </div>
  );
}

export default DiscoverContent;
