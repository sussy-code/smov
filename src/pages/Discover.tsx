import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ThinContainer } from "@/components/layout/ThinContainer";
import { WideContainer } from "@/components/layout/WideContainer";
import { HomeLayout } from "@/pages/layouts/HomeLayout";
import { conf } from "@/setup/config";
import { useThemeStore } from "@/stores/theme";

import { PageTitle } from "./parts/util/PageTitle";
import { allThemes } from "../../themes/all";
import { get } from "../backend/metadata/tmdb";
import { Icon, Icons } from "../components/Icon";

// Define the Media type
interface Media {
  id: number;
  poster_path: string;
  title?: string;
  name?: string;
}

// Update the Movie and TVShow interfaces to extend the Media interface
interface Movie extends Media {
  title: string;
}

interface TVShow extends Media {
  name: string;
}

// Define the Genre type
interface Genre {
  id: number;
  name: string;
}

// Define the Category type
interface Category {
  name: string;
  endpoint: string;
}

// Define the categories
const categories: Category[] = [
  {
    name: "Now Playing",
    endpoint: "/movie/now_playing?language=en-US",
  },
  {
    name: "Top Rated",
    endpoint: "/movie/top_rated?language=en-US",
  },
];

export function Discover() {
  const { t } = useTranslation();
  const [showBg] = useState<boolean>(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null); // Add this line
  const [genreMovies, setGenreMovies] = useState<{
    [genreId: number]: Movie[];
  }>({});
  const [countdown, setCountdown] = useState<number | null>(null);
  const themeName = useThemeStore((s) => s.theme);
  const currentTheme = allThemes.find((y) => y.name === themeName);
  const bgColor =
    currentTheme?.extend?.colors?.background?.accentA ?? "#7831BF";
  const navigate = useNavigate();

  // Add a new state variable for the category movies
  const [categoryMovies, setCategoryMovies] = useState<{
    [categoryName: string]: Movie[];
  }>({});

  useEffect(() => {
    const fetchMoviesForCategory = async (category: Category) => {
      try {
        const data = await get<any>(category.endpoint, {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });

        setCategoryMovies((prevCategoryMovies) => ({
          ...prevCategoryMovies,
          [category.name]: data.results,
        }));
      } catch (error) {
        console.error(
          `Error fetching movies for category ${category.name}:`,
          error,
        );
      }
    };
    categories.forEach(fetchMoviesForCategory);
  }, []);

  // Add a new state variable for the TV show genres
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);

  // Add a new state variable for the TV shows
  const [tvShowGenres, setTVShowGenres] = useState<{
    [genreId: number]: TVShow[];
  }>({});

  // Fetch TV show genres
  useEffect(() => {
    const fetchTVGenres = async () => {
      try {
        const data = await get<any>("/genre/tv/list", {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });

        // Shuffle the array of genres
        for (let i = data.genres.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [data.genres[i], data.genres[j]] = [data.genres[j], data.genres[i]];
        }

        // Fetch only the first 5 TV show genres
        setTVGenres(data.genres.slice(0, 5));
      } catch (error) {
        console.error("Error fetching TV show genres:", error);
      }
    };

    fetchTVGenres();
  }, []);

  // Fetch TV shows for each genre
  useEffect(() => {
    const fetchTVShowsForGenre = async (genreId: number) => {
      try {
        const data = await get<any>("/discover/tv", {
          api_key: conf().TMDB_READ_API_KEY,
          with_genres: genreId.toString(),
          language: "en-US",
        });
        setTVShowGenres((prevTVShowGenres) => ({
          ...prevTVShowGenres,
          [genreId]: data.results,
        }));
      } catch (error) {
        console.error(`Error fetching TV shows for genre ${genreId}:`, error);
      }
    };

    tvGenres.forEach((genre) => fetchTVShowsForGenre(genre.id));
  }, [tvGenres]);

  // Move the hooks outside of the renderMovies function
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const gradientRef = useRef<HTMLDivElement>(null);

  // Update the scrollCarousel function to use the new ref map
  function scrollCarousel(categorySlug: string, direction: string) {
    const carousel = carouselRefs.current[categorySlug];
    if (carousel) {
      const movieElements = carousel.getElementsByTagName("a");
      if (movieElements.length > 0) {
        const movieWidth = movieElements[0].offsetWidth;
        const visibleMovies = Math.floor(carousel.offsetWidth / movieWidth);
        const scrollAmount = movieWidth * visibleMovies;
        if (direction === "left") {
          carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
          carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }
  }

  const [movieWidth, setMovieWidth] = useState(
    window.innerWidth < 600 ? "150px" : "200px",
  );

  useEffect(() => {
    const handleResize = () => {
      setMovieWidth(window.innerWidth < 600 ? "150px" : "200px");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (carouselRef.current && gradientRef.current) {
      const carouselHeight = carouselRef.current.getBoundingClientRect().height;
      gradientRef.current.style.top = `${carouselHeight}px`;
      gradientRef.current.style.bottom = `${carouselHeight}px`;
    }
  }, [movieWidth]); // Added movieWidth to the dependency array

  let isScrolling = false;

  function handleWheel(e: React.WheelEvent, categorySlug: string) {
    if (isScrolling) {
      return;
    }

    isScrolling = true;

    const carousel = carouselRefs.current[categorySlug];
    if (carousel) {
      const movieElements = carousel.getElementsByTagName("a");
      if (movieElements.length > 0) {
        const posterWidth = movieElements[0].offsetWidth;
        const visibleMovies = Math.floor(carousel.offsetWidth / posterWidth);
        const scrollAmount = posterWidth * visibleMovies * 0.6;
        if (e.deltaY < 5) {
          carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
          carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }

    setTimeout(() => {
      isScrolling = false;
    }, 345); // Disable scrolling every 3 milliseconds after interaction (only for mouse wheel doe)
  }

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    document.body.style.overflow = "hidden";
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    document.body.style.overflow = "auto";
    setIsHovered(false);
  };

  function renderMovies(medias: Media[], category: string, isTVShow = false) {
    const categorySlug = category.toLowerCase().replace(/ /g, "-"); // Convert the category to a slug
    const displayCategory =
      category === "Now Playing"
        ? "In Cinemas"
        : category.includes("Movie")
          ? `${category}s`
          : isTVShow
            ? `${category} Shows`
            : `${category} Movies`;
    return (
      <div
        className="relative overflow-hidden mt-4 rounded-xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={(e) => handleWheel(e, categorySlug)}
      >
        <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-2xl mx-auto pl-2">
          {displayCategory}
        </h2>
        <div
          id={`carousel-${categorySlug}`}
          className="flex whitespace-nowrap overflow-auto scrollbar pb-6 mb-4 mt-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${bgColor} transparent`,
          }}
          ref={(el) => {
            carouselRefs.current[categorySlug] = el;
          }}
        >
          {medias.slice(0, 20).map((media) => (
            <a
              key={media.id}
              href={`media/tmdb-${isTVShow ? "tv" : "movie"}-${media.id}-${
                isTVShow ? media.name : media.title
              }`}
              rel="noopener noreferrer"
              className="block text-center relative overflow-hidden transition-transform transform hover:scale-95 mr-5"
              style={{ flex: `0 0 ${movieWidth}` }} // Set a fixed width for each movie
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                alt={isTVShow ? media.name : media.title}
                className="rounded-xl"
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  transition: "opacity 0.3s, transform 0.3s",
                }}
              />
            </a>
          ))}
        </div>
        <button
          type="button"
          title="Back"
          className="absolute top-1/2 transform -translate-y-1/2 z-10 left-2"
          onClick={() => scrollCarousel(categorySlug, "left")}
        >
          <div className="cursor-pointer text-white flex justify-center items-center h-10 w-10 rounded-full bg-search-hoverBackground active:scale-110 transition-[transform,background-color] duration-200">
            <Icon icon={Icons.ARROW_LEFT} />
          </div>
        </button>
        <button
          type="button"
          title="Next"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10"
          onClick={() => scrollCarousel(categorySlug, "right")}
        >
          <div className="cursor-pointer text-white flex justify-center items-center h-10 w-10 rounded-full bg-search-hoverBackground active:scale-110 transition-[transform,background-color] duration-200">
            <Icon icon={Icons.ARROW_RIGHT} />
          </div>
        </button>
      </div>
    );
  }
  const [countdownTimeout, setCountdownTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const handleRandomMovieClick = () => {
    const allMovies = Object.values(genreMovies).flat(); // Flatten all movie arrays
    const uniqueTitles = new Set<string>(); // Use a Set to store unique titles
    allMovies.forEach((movie) => uniqueTitles.add(movie.title)); // Add each title to the Set
    const uniqueTitlesArray = Array.from(uniqueTitles); // Convert the Set back to an array
    const randomIndex = Math.floor(Math.random() * uniqueTitlesArray.length);
    const selectedMovie = allMovies.find(
      (movie) => movie.title === uniqueTitlesArray[randomIndex],
    );

    if (selectedMovie) {
      setRandomMovie(selectedMovie);

      if (countdown !== null && countdown > 0) {
        // Clear the countdown interval
        setCountdown(null);
        if (countdownTimeout) {
          clearTimeout(countdownTimeout);
          setCountdownTimeout(null);
          setRandomMovie(null);
        }
      } else {
        setCountdown(5);

        // Schedule navigation after 5 seconds
        const timeoutId = setTimeout(() => {
          navigate(
            `/media/tmdb-movie-${selectedMovie.id}-${selectedMovie.title}`,
          );
        }, 5000);
        setCountdownTimeout(timeoutId);
      }
    }
  };

  // Fetch Movie genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await get<any>("/genre/movie/list", {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });

        // Shuffle the array of genres
        for (let i = data.genres.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [data.genres[i], data.genres[j]] = [data.genres[j], data.genres[i]];
        }

        // Fetch only the first 5 genres
        setGenres(data.genres.slice(0, 5));
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Fetch movies for each genre
  useEffect(() => {
    const fetchMoviesForGenre = async (genreId: number) => {
      try {
        const movies: any[] = [];
        for (let page = 1; page <= 6; page += 1) {
          // Fetch only 6 pages
          const data = await get<any>("/discover/movie", {
            api_key: conf().TMDB_READ_API_KEY,
            with_genres: genreId.toString(),
            language: "en-US",
            page: page.toString(),
          });

          movies.push(...data.results);
        }
        setGenreMovies((prevGenreMovies) => ({
          ...prevGenreMovies,
          [genreId]: movies,
        }));
      } catch (error) {
        console.error(`Error fetching movies for genre ${genreId}:`, error);
      }
    };

    genres.forEach((genre) => fetchMoviesForGenre(genre.id));
  }, [genres]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) =>
          prevCountdown !== null ? prevCountdown - 1 : prevCountdown,
        );
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown]);

  return (
    <HomeLayout showBg={showBg}>
      <div className="mb-16 sm:mb-2">
        <PageTitle subpage k="global.pages.discover" />
        <ThinContainer>
          <div className="mt-44 space-y-16 text-center">
            <div className="relative z-10 mb-16">
              <h1 className="text-4xl font-bold text-white">
                {t("global.pages.discover")}
              </h1>
            </div>
          </div>
        </ThinContainer>
      </div>
      <WideContainer>
        <>
          <div className="flex items-center justify-center mb-6">
            <button
              type="button"
              className="flex items-center space-x-2 rounded-full px-4 text-white py-2 bg-pill-background bg-opacity-50 hover:bg-pill-backgroundHover transition-[background,transform] duration-100 hover:scale-105"
              onClick={handleRandomMovieClick}
            >
              <span className="flex items-center">
                {countdown !== null && countdown > 0 ? (
                  <div className="flex items-center inline-block">
                    <span>Cancel Countdown</span>
                    <Icon
                      icon={Icons.X}
                      className="text-2xl ml-[4.5px] mb-[-0.7px]"
                    />
                  </div>
                ) : (
                  <div className="flex items-center inline-block">
                    <span>Watch Something New</span>
                    <img
                      src="/lightbar-images/dice.svg"
                      alt="Small Image"
                      style={{
                        marginLeft: "8px",
                      }}
                    />
                  </div>
                )}
              </span>
            </button>
          </div>
          {randomMovie && (
            <div className="mt-4 mb-4 text-center">
              <p>Now Playing {randomMovie.title}</p>
            </div>
          )}
          <div className="flex flex-col">
            {categories.map((category) => (
              <div
                key={category.name}
                id={`carousel-${category.name
                  .toLowerCase()
                  .replace(/ /g, "-")}`}
                className="mt-8"
              >
                {renderMovies(
                  categoryMovies[category.name] || [],
                  category.name,
                )}
              </div>
            ))}
            {genres.map((genre) => (
              <div
                key={genre.id}
                id={`carousel-${genre.name.toLowerCase().replace(/ /g, "-")}`}
                className="mt-8"
              >
                {renderMovies(genreMovies[genre.id] || [], genre.name)}
              </div>
            ))}
            {tvGenres.map((genre) => (
              <div
                key={genre.id}
                id={`carousel-${genre.name.toLowerCase().replace(/ /g, "-")}`}
                className="mt-8"
              >
                {renderMovies(tvShowGenres[genre.id] || [], genre.name, true)}
              </div>
            ))}
          </div>
        </>
      </WideContainer>
    </HomeLayout>
  );
}
