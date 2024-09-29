// Based mfs only use only one 500 line file instead of ten 50 line files.
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { get } from "@/backend/metadata/tmdb";
import { Divider } from "@/components/utils/Divider";
import { Flare } from "@/components/utils/Flare";
import { useIsMobile } from "@/hooks/useIsMobile";
import { conf } from "@/setup/config";
import {
  Category,
  Genre,
  Media,
  Movie,
  TVShow,
  categories,
  tvCategories,
} from "@/utils/discover";

import { Icon, Icons } from "../components/Icon";

const editorPicks = [
  { id: 9342, type: "movie" }, // The Mask of Zorro
  { id: 293, type: "movie" }, // A River Runs Through It
  { id: 370172, type: "movie" }, // No Time To Die
  { id: 661374, type: "movie" }, // The Glass Onion
  { id: 207, type: "movie" }, // Dead Poets Society
  { id: 378785, type: "movie" }, // The Best of the Blues Brothers
  { id: 335984, type: "movie" }, // Blade Runner 2049
  { id: 13353, type: "movie" }, // It's the Great Pumpkin, Charlie Brown
  { id: 27205, type: "movie" }, // Inception
  { id: 106646, type: "movie" }, // The Wolf of Wall Street
  { id: 334533, type: "movie" }, // Captain Fantastic
  { id: 693134, type: "movie" }, // Dune: Part Two
  { id: 765245, type: "movie" }, // Swan Song
  { id: 264660, type: "movie" }, // Ex Machina
  { id: 92591, type: "movie" }, // Bernie
  { id: 976893, type: "movie" }, // Perfect Days
];

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Throttle scroll event for performance
  const toggleVisibility = () => {
    const scrolled = window.scrollY > 300; // Show button after 300px of scrolling
    setIsVisible(scrolled);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Throttle the scroll event to fire every 100ms for better performance
      const timeout = setTimeout(toggleVisibility, 100);
      return () => clearTimeout(timeout);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* Glow Effect (Behind the Button) */}
      <div
        className={`absolute inset-0 mx-auto h-[50px] w-[200px] rounded-full blur-[50px] opacity-50 pointer-events-none z-0 ${
          isVisible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(var(--colors-buttons-purpleHover)), rgba(var(--colors-progress-filled)))`,
          transition: "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
        }}
      />

      {/* Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`relative flex items-center justify-center space-x-2 rounded-full px-4 py-3 text-lg font-semibold text-white bg-pill-background bg-opacity-80 hover:bg-pill-backgroundHover transition-opacity hover:scale-105 transition-transform duration-500 ease-in-out ${
          isVisible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          transition: "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
        }}
      >
        {/* Button Content */}
        <Icon icon={Icons.CHEVRON_UP} className="text-2xl z-10" />
        <span className="z-10">Back to top</span>
      </button>
    </div>
  );
}

export function DiscoverContent() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [genreMovies, setGenreMovies] = useState<{
    [genreId: number]: Movie[];
  }>({});

  const [providerMovies, setProviderMovies] = useState<{
    [providerId: string]: Movie[];
  }>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedProvider, setSelectedProvider] = useState({
    name: "",
    id: "",
  });
  const [providerTVShows, setProviderTVShows] = useState<{
    [providerId: string]: Movie[];
  }>({});
  const [selectedTVProvider, setSelectedTVProvider] = useState({
    name: "",
    id: "",
  });
  const movieProviders = [
    { name: "Netflix", id: "8" },
    { name: "Apple TV+", id: "2" },
    { name: "Amazon Prime Video", id: "10" },
    { name: "Hulu", id: "15" },
    { name: "Max", id: "1899" },
    { name: "Paramount Plus", id: "531" },
    { name: "Disney Plus", id: "337" },
    { name: "Shudder", id: "99" },
  ];

  const tvProviders = [
    { name: "Netflix", id: "8" },
    { name: "Apple TV+", id: "350" },
    { name: "Paramount Plus", id: "531" },
    { name: "Hulu", id: "15" },
    { name: "Max", id: "1899" },
    { name: "Disney Plus", id: "337" },
    { name: "fubuTV", id: "257" },
  ];

  const [countdown, setCountdown] = useState<number | null>(null);
  const navigate = useNavigate();
  const [categoryShows, setCategoryShows] = useState<{
    [categoryName: string]: Movie[];
  }>({});
  const [categoryMovies, setCategoryMovies] = useState<{
    [categoryName: string]: Movie[];
  }>({});
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [tvShowGenres, setTVShowGenres] = useState<{
    [genreId: number]: TVShow[];
  }>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const gradientRef = useRef<HTMLDivElement>(null);
  const [countdownTimeout, setCountdownTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const { isMobile } = useIsMobile();

  const [editorPicksData, setEditorPicksData] = useState<Media[]>([]);

  // State to track selected category (movies or TV shows)
  const [selectedCategory, setSelectedCategory] = useState("movies");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Handle category change for both event (from <select>) and string (from custom dropdown)
  const handleCategoryChange = (
    eventOrValue: React.ChangeEvent<HTMLSelectElement> | string,
  ) => {
    if (typeof eventOrValue === "string") {
      // Handle case where a string value is passed (from custom dropdown)
      setSelectedCategory(eventOrValue);
    } else {
      // Handle the <select> change event
      setSelectedCategory(eventOrValue.target.value);
    }
    setDropdownOpen(false); // Close dropdown after selection
  };

  useEffect(() => {
    // Function to shuffle array
    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const fetchEditorPicks = async () => {
      try {
        // Shuffle the editorPicks array
        const shuffledPicks = shuffleArray([...editorPicks]);

        const promises = shuffledPicks.map(async (pick) => {
          const endpoint =
            pick.type === "movie" ? `/movie/${pick.id}` : `/tv/${pick.id}`;
          const data = await get<any>(endpoint, {
            api_key: conf().TMDB_READ_API_KEY,
            language: "en-US",
          });
          return {
            ...data,
            type: pick.type,
          };
        });
        const results = await Promise.all(promises);
        setEditorPicksData(results);
      } catch (error) {
        console.error("Error fetching editor picks:", error);
      }
    };

    fetchEditorPicks();
  }, []);

  useEffect(() => {
    const fetchMoviesForCategory = async (category: Category) => {
      try {
        const data = await get<any>(category.endpoint, {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });

        // Shuffle the movies
        for (let i = data.results.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [data.results[i], data.results[j]] = [
            data.results[j],
            data.results[i],
          ];
        }

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

  useEffect(() => {
    const fetchShowsForCategory = async (category: Category) => {
      try {
        const data = await get<any>(category.endpoint, {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });

        // Shuffle the TV shows
        for (let i = data.results.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [data.results[i], data.results[j]] = [
            data.results[j],
            data.results[i],
          ];
        }

        setCategoryShows((prevCategoryShows) => ({
          ...prevCategoryShows,
          [category.name]: data.results,
        }));
      } catch (error) {
        console.error(
          `Error fetching movies for category ${category.name}:`,
          error,
        );
      }
    };
    tvCategories.forEach(fetchShowsForCategory);
  }, []);

  // Fetch TV show genres
  useEffect(() => {
    const fetchTVGenres = async () => {
      try {
        const data = await get<any>("/genre/tv/list", {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });

        // Shuffle the array of genres
        // for (let i = data.genres.length - 1; i > 0; i -= 1) {
        //   const j = Math.floor(Math.random() * (i + 1));
        //   [data.genres[i], data.genres[j]] = [data.genres[j], data.genres[i]];
        // }

        // Fetch only the first 10 TV show genres
        setTVGenres(data.genres.slice(0, 10));
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

        // Shuffle the TV shows
        for (let i = data.results.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [data.results[i], data.results[j]] = [
            data.results[j],
            data.results[i],
          ];
        }

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

  // Fetch Movie genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await get<any>("/genre/movie/list", {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });

        // Shuffle the array of genres
        // for (let i = data.genres.length - 1; i > 0; i -= 1) {
        //   const j = Math.floor(Math.random() * (i + 1));
        //   [data.genres[i], data.genres[j]] = [data.genres[j], data.genres[i]];
        // }

        // Fetch only the first 12 genres
        setGenres(data.genres.slice(0, 12));
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

        // Shuffle the movies
        for (let i = movies.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [movies[i], movies[j]] = [movies[j], movies[i]];
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

  // Fetch Movies By Provider
  const fetchMoviesByProvider = async (providerId: string) => {
    try {
      const movies: any[] = [];
      // eslint-disable-next-line no-plusplus
      for (let page = 1; page <= 3; page++) {
        const data = await get<any>("/discover/movie", {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
          page: page.toString(),
          with_watch_providers: providerId,
          watch_region: "US", // You can set a specific region if required
        });

        movies.push(...data.results);
      }
      setProviderMovies((prev) => ({
        ...prev,
        [providerId]: movies,
      }));
    } catch (error) {
      console.error(`Error fetching movies for provider ${providerId}:`, error);
    }
  };

  useEffect(() => {
    const randomMovieProvider =
      movieProviders[Math.floor(Math.random() * movieProviders.length)];
    setSelectedProvider(randomMovieProvider); // Store the selected provider

    fetchMoviesByProvider(randomMovieProvider.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch TV Shows By Provider
  const fetchTVByProvider = async (providerId: string) => {
    try {
      const series: any[] = [];
      // eslint-disable-next-line no-plusplus
      for (let page = 1; page <= 3; page++) {
        const data = await get<any>("/discover/tv", {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
          page: page.toString(),
          with_watch_providers: providerId,
          watch_region: "US", // You can set a specific region if required
        });

        series.push(...data.results);
      }
      setProviderTVShows((prev) => ({
        ...prev,
        [providerId]: series,
      }));
    } catch (error) {
      console.error(
        `Error fetching tv shows for provider ${providerId}:`,
        error,
      );
    }
  };

  useEffect(() => {
    const randomTVProvider =
      tvProviders[Math.floor(Math.random() * tvProviders.length)];
    setSelectedTVProvider(randomTVProvider); // Store the selected provider

    fetchTVByProvider(randomTVProvider.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrollCarousel(categorySlug: string, direction: string) {
    const carousel = carouselRefs.current[categorySlug];
    if (carousel) {
      const movieElements = carousel.getElementsByTagName("a");
      if (movieElements.length > 0) {
        const movieWidth = movieElements[0].offsetWidth;
        const visibleMovies = Math.floor(carousel.offsetWidth / movieWidth);

        // Scroll 2 posters by default, but scroll 4 if more than 5 are visible
        let scrollAmount = movieWidth * 2;
        if (visibleMovies > 5) {
          scrollAmount = movieWidth * 4;
        }

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

  const browser = !!window.chrome; // detect chromium browser
  let isScrolling = false;

  function handleWheel(e: React.WheelEvent, _categorySlug: string) {
    if (isScrolling) {
      return;
    }

    isScrolling = true;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (browser) {
      setTimeout(() => {
        isScrolling = false;
      }, 345); // disable scrolling after 345 milliseconds for chromium-based browsers
    } else {
      // immediately reset isScrolling for non-chromium browsers
      isScrolling = false;
    }
  }

  useEffect(() => {
    if (carouselRef.current && gradientRef.current) {
      const carouselHeight = carouselRef.current.getBoundingClientRect().height;
      gradientRef.current.style.top = `${carouselHeight}px`;
      gradientRef.current.style.bottom = `${carouselHeight}px`;
    }
  }, [movieWidth]);

  function renderMovies(medias: Media[], category: string, isTVShow = false) {
    const categorySlug = `${category.toLowerCase().replace(/ /g, "-")}${Math.random()}`; // Convert the category to a slug
    const displayCategory =
      category === "Now Playing"
        ? "In Cinemas"
        : category === "Editor Picks" // Check for "Editor Picks" specifically
          ? category
          : category === `Popular Movies on ${selectedProvider.name}`
            ? `Popular Movies on ${selectedProvider.name}`
            : category === `Popular Shows on ${selectedTVProvider.name}`
              ? `Popular Shows on ${selectedTVProvider.name}`
              : category.includes("Movie")
                ? `${category}s`
                : isTVShow
                  ? `${category} Shows`
                  : `${category} Movies`;

    // https://tailwindcss.com/docs/border-style
    return (
      <div className="relative overflow-hidden">
        <h2 className="mt-2 text-2xl cursor-default font-bold text-white sm:text-3xl md:text-2xl mx-auto pl-5">
          {displayCategory}
        </h2>
        <div
          id={`carousel-${categorySlug}`}
          className="flex whitespace-nowrap pt-0 pb-4 overflow-auto scrollbar rounded-xl overflow-y-hidden"
          style={{
            scrollbarWidth: "thin",
            // scrollbarColor: `${bgColor} transparent`,
            scrollbarColor: "transparent transparent",
          }}
          ref={(el) => {
            carouselRefs.current[categorySlug] = el;
          }}
          onWheel={(e) => handleWheel(e, categorySlug)}
        >
          {medias
            .filter((media, index, self) => {
              return (
                index ===
                self.findIndex(
                  (m) => m.id === media.id && m.title === media.title,
                )
              );
            })
            .slice(0, 20)
            .map((media) => (
              <a
                key={media.id}
                onClick={() =>
                  navigate(
                    `/media/tmdb-${isTVShow ? "tv" : "movie"}-${media.id}-${
                      isTVShow ? media.name : media.title
                    }`,
                  )
                }
                className="discover-card max-h-200 text-center relative mt-3 mx-[0.285em] transition-transform duration-[0.45s] hover:scale-105"
                style={{ flex: `0 0 ${movieWidth}` }} // Set a fixed width for each movie
              >
                <Flare.Base className="group cursor-pointer rounded-xl relative p-[0.65em] bg-background-main transition-colors duration-300 bg-transparent">
                  <Flare.Light
                    flareSize={300}
                    cssColorVar="--colors-mediaCard-hoverAccent"
                    backgroundClass="bg-mediaCard-hoverBackground duration-200"
                    className="rounded-xl bg-background-main group-hover:opacity-100"
                  />
                  <img
                    src={
                      media.poster_path
                        ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                        : "/placeholder.png"
                    }
                    alt={media.poster_path ? "" : "failed to fetch :("}
                    className="rounded-xl relative"
                  />
                  <h1 className="group relative pt-2 pr-1 text-[13.5px] whitespace-normal duration-[0.35s] font-semibold text-white opacity-0 group-hover:opacity-100 flex items-center">
                    <span className="flex-1 text-center">
                      {isTVShow
                        ? (media.name?.length ?? 0) > 32
                          ? `${media.name?.slice(0, 32)}...`
                          : media.name
                        : (media.title?.length ?? 0) > 32
                          ? `${media.title?.slice(0, 32)}...`
                          : media.title}
                    </span>
                  </h1>
                </Flare.Base>
              </a>
            ))}
        </div>

        {!isMobile && (
          <div className="flex items-center justify-center">
            <button
              type="button"
              title="Back"
              className="absolute left-5 top-1/2 transform -translate-y-3/4 z-10"
              onClick={() => scrollCarousel(categorySlug, "left")}
            >
              <div className="cursor-pointer text-white flex justify-center items-center h-10 w-10 rounded-full bg-search-hoverBackground active:scale-110 transition-[transform,background-color] duration-200">
                <Icon icon={Icons.ARROW_LEFT} />
              </div>
            </button>
            <button
              type="button"
              title="Next"
              className="absolute right-5 top-1/2 transform -translate-y-3/4 z-10"
              onClick={() => scrollCarousel(categorySlug, "right")}
            >
              <div className="cursor-pointer text-white flex justify-center items-center h-10 w-10 rounded-full bg-search-hoverBackground active:scale-110 transition-[transform,background-color] duration-200">
                <Icon icon={Icons.ARROW_RIGHT} />
              </div>
            </button>
          </div>
        )}
      </div>
    );
  }

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
        // Clear the countdown
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

  const renderTopMovieButtons = () => {
    const buttons = [];
    // Categories
    for (const [index, category] of categories.entries()) {
      buttons.push(
        <button
          type="button"
          key={index}
          className="whitespace-nowrap flex items-center space-x-2 rounded-full px-4 text-white py-2 bg-pill-background bg-opacity-50 hover:bg-pill-backgroundHover transition-[background,transform] duration-100 hover:scale-105"
          onClick={() => {
            const element = document.getElementById(
              `carousel-${category.name.toLowerCase().replace(/ /g, "-")}`,
            );
            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }
          }}
        >
          {category.name}
        </button>,
      );
    }
    return buttons;
  };

  const renderMovieButtons = () => {
    const buttons = [];
    // Genres
    for (const [index, genre] of genres.entries()) {
      buttons.push(
        <button
          type="button"
          key={index + categories.length}
          className="whitespace-nowrap flex items-center space-x-2 rounded-full px-4 text-white py-2 bg-pill-background bg-opacity-50 hover:bg-pill-backgroundHover transition-[background,transform] duration-100 hover:scale-105"
          onClick={() => {
            const element = document.getElementById(
              `carousel-${genre.name.toLowerCase().replace(/ /g, "-")}`,
            );
            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }
          }}
        >
          {genre.name}
        </button>,
      );
    }
    return buttons;
  };

  const renderMovieProviderButtons = () => {
    const buttons = [];
    // Movie Providers
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [index, provider] of movieProviders.entries()) {
      buttons.push(
        <button
          type="button"
          key={provider.id}
          className="whitespace-nowrap flex items-center space-x-2 rounded-full px-4 text-white py-2 bg-pill-background bg-opacity-50 hover:bg-pill-backgroundHover transition-[background,transform] duration-100 hover:scale-105"
          onClick={() => {
            // Update the selected provider
            setSelectedProvider({
              name: provider.name,
              id: provider.id,
            });

            // Fetch new data based on selected provider
            fetchMoviesByProvider(provider.id); // Fetch data using provider ID

            // Delay scroll until the selectedProvider state is updated
            setTimeout(() => {
              const element = document.getElementById("carousel-providers");
              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "center",
                });
              }
            }, 300); // Delay to ensure state is updated
          }}
        >
          {provider.name}
        </button>,
      );
    }
    return buttons;
  };

  const renderTopTvButtons = () => {
    const buttons = [];
    // TV Categories
    for (const [index, category] of tvCategories.entries()) {
      buttons.push(
        <button
          type="button"
          key={index}
          className="whitespace-nowrap flex items-center space-x-2 rounded-full px-4 text-white py-2 bg-pill-background bg-opacity-50 hover:bg-pill-backgroundHover transition-[background,transform] duration-100 hover:scale-105"
          onClick={() => {
            const element = document.getElementById(
              `tv-carousel-${category.name.toLowerCase().replace(/ /g, "-")}`,
            );
            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }
          }}
        >
          {category.name}
        </button>,
      );
    }
    return buttons;
  };

  const renderTvButtons = () => {
    const buttons = [];
    // TV Genres
    for (const [index, genre] of tvGenres.entries()) {
      buttons.push(
        <button
          type="button"
          key={index + tvCategories.length}
          className="whitespace-nowrap flex items-center space-x-2 rounded-full px-4 text-white py-2 bg-pill-background bg-opacity-50 hover:bg-pill-backgroundHover transition-[background,transform] duration-100 hover:scale-105"
          onClick={() => {
            const element = document.getElementById(
              `tv-carousel-${genre.name.toLowerCase().replace(/ /g, "-")}`,
            );
            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }
          }}
        >
          {genre.name}
        </button>,
      );
    }
    return buttons;
  };

  const renderTvProviderButtons = () => {
    const buttons = [];
    // Movie Providers
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [index, provider] of tvProviders.entries()) {
      buttons.push(
        <button
          type="button"
          key={provider.id}
          className="whitespace-nowrap flex items-center space-x-2 rounded-full px-4 text-white py-2 bg-pill-background bg-opacity-50 hover:bg-pill-backgroundHover transition-[background,transform] duration-100 hover:scale-105"
          onClick={() => {
            // Update the selected provider
            setSelectedTVProvider({
              name: provider.name,
              id: provider.id,
            });

            // Fetch new data based on selected provider
            fetchTVByProvider(provider.id); // Fetch data using provider ID

            // Delay scroll until the selectedProvider state is updated
            setTimeout(() => {
              const element = document.getElementById("carousel-tv-providers");
              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "center",
                });
              }
            }, 300); // Delay to ensure state is updated
          }}
        >
          {provider.name}
        </button>,
      );
    }
    return buttons;
  };

  const renderScrollButton = (
    categorySlug: string,
    direction: "left" | "right",
  ) => (
    <button
      type="button"
      key={`${categorySlug}-${direction}`}
      className="flex items-center rounded-full px-4 text-white py-3"
      onClick={() => {
        const element = document.getElementById(
          `button-carousel-${categorySlug}`,
        );
        const scrollAmount = 200;

        if (element) {
          if (direction === "left") {
            element.scrollBy({ left: -scrollAmount, behavior: "smooth" });
          } else {
            element.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }
        }
      }}
    >
      {direction === "left" ? (
        <Icon icon={Icons.CHEVRON_LEFT} className="text-2xl" />
      ) : (
        <Icon icon={Icons.CHEVRON_RIGHT} className="text-2xl" />
      )}
    </button>
  );

  return (
    <div>
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-center">
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
      </div>
      {randomMovie && (
        <div className="mt-4 mb-4 text-center">
          <p>
            Now Playing <span className="font-bold">{randomMovie.title}</span>{" "}
            in {countdown}
          </p>
        </div>
      )}
      <div className="mt-8 p-4 w-full max-w-screen-xl mx-auto">
        <div className="relative flex justify-center mb-4">
          {/* Custom dropdown button */}
          <button
            type="button"
            className="text-2xl font-bold p-2 bg-transparent text-center rounded-full cursor-pointer flex items-center"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            {selectedCategory === "movies" ? "Movies" : "TV Shows"}
            <Icon
              icon={isDropdownOpen ? Icons.CHEVRON_UP : Icons.CHEVRON_DOWN}
              className="ml-2 text-2xl pt-1"
            />
          </button>

          {/* Dropdown options */}
          {isDropdownOpen && (
            <ul className="absolute top-full z-50 mb-1 rounded-lg bg-dropdown-background py-3 px-5 text-left text-white shadow-md border-2 border-gray-800 focus:outline-none tabbable cursor-pointer">
              <li
                className={`cursor-pointer p-2 hover:text-gray-300 ${selectedCategory === "movies" ? "font-bold" : ""}`}
                onClick={() => handleCategoryChange("movies")}
              >
                Movies
              </li>
              <li
                className={`cursor-pointer p-2 hover:text-gray-300 ${selectedCategory === "tvshows" ? "font-bold" : ""}`}
                onClick={() => handleCategoryChange("tvshows")}
              >
                TV Shows
              </li>
            </ul>
          )}
        </div>

        {/* Render Movies */}
        {selectedCategory === "movies" && (
          <>
            <div className="flex justify-center overflow-x-auto">
              {isMobile && (
                <div className="">
                  {renderScrollButton("providers", "left")}
                </div>
              )}
              <div
                id="button-carousel-providers"
                className="flex mb-4 overflow-x-auto scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                <div className="flex space-x-2 py-1">
                  {renderMovieProviderButtons()}
                </div>
              </div>
              {isMobile && (
                <div className="">
                  {renderScrollButton("providers", "right")}
                </div>
              )}
            </div>
            <div className="flex mb-4 overflow-x-auto">
              <div className="">{renderScrollButton("movies", "left")}</div>
              <div
                id="button-carousel-movies"
                className="flex mb-4 overflow-x-auto scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                <div className="flex space-x-2 py-1">
                  {renderTopMovieButtons()}
                  {renderMovieButtons()}
                </div>
              </div>
              <div className="">{renderScrollButton("movies", "right")}</div>
            </div>
          </>
        )}

        {/* Render Shows */}
        {selectedCategory === "tvshows" && (
          <>
            <div className="flex justify-center overflow-x-auto">
              {isMobile && (
                <div className="">
                  {renderScrollButton("tv-providers", "left")}
                </div>
              )}
              <div
                id="button-carousel-tv-providers"
                className="flex mb-4 overflow-x-auto scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                <div className="flex space-x-2 py-1">
                  {renderTvProviderButtons()}
                </div>
              </div>
              {isMobile && (
                <div className="">
                  {renderScrollButton("tv-providers", "right")}
                </div>
              )}
            </div>
            <div className="flex mb-4 overflow-x-auto">
              <div className="">{renderScrollButton("tvshows", "left")}</div>
              <div
                id="button-carousel-tvshows"
                className="flex mb-4 overflow-x-auto scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                <div className="flex space-x-2 py-1">
                  {renderTopTvButtons()}
                  {renderTvButtons()}
                </div>
              </div>
              <div className="">{renderScrollButton("tvshows", "right")}</div>
            </div>
          </>
        )}
      </div>
      <div className="">
        <div className="flex items-center mt-5">
          <Divider marginClass="mr-5" />
          <h1 className="text-4xl font-bold text-white mx-auto whitespace-nowrap">
            Editor Picks
          </h1>
          <Divider marginClass="ml-5" />
        </div>
        {/* Editor Picks Section */}
        <div className="mt-8">
          {editorPicksData.length > 0 && (
            <div className="mt-8">
              {renderMovies(editorPicksData, "Editor Picks")}
            </div>
          )}
        </div>
        {selectedCategory === "movies" && (
          <>
            <div className="flex items-center mt-5 mb-4">
              <Divider marginClass="mr-5" />
              <h1 className="text-4xl font-bold text-white mx-auto">Movies</h1>
              <Divider marginClass="ml-5" />
            </div>
            <div className="flex justify-center overflow-x-auto">
              {isMobile && (
                <div className="">
                  {renderScrollButton("providers", "left")}
                </div>
              )}
              <div
                id="button-carousel-providers"
                className="flex mb-4 overflow-x-auto scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                <div className="flex space-x-2 py-1">
                  {renderMovieProviderButtons()}
                </div>
              </div>
              {isMobile && (
                <div className="">
                  {renderScrollButton("providers", "right")}
                </div>
              )}
            </div>
            <div
              key={`carousel-providers-${selectedProvider.id}`}
              id="carousel-providers"
            >
              {selectedProvider.id ? (
                providerMovies[selectedProvider.id] &&
                providerMovies[selectedProvider.id].length > 0 ? (
                  renderMovies(
                    providerMovies[selectedProvider.id],
                    `Popular Movies on ${selectedProvider.name}`,
                  )
                ) : (
                  <p className="text-center text-gray-600">
                    No movies available for {selectedProvider.name}.
                  </p>
                )
              ) : (
                <p className="text-center text-gray-600">
                  Please select a provider to view movies.
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-0 mt-4">
              {" "}
              {categories.map((category) => (
                <div
                  key={category.name}
                  id={`carousel-${category.name.toLowerCase().replace(/ /g, "-")}`}
                  className=""
                >
                  {renderMovies(
                    categoryMovies[category.name] || [],
                    category.name,
                  )}
                </div>
              ))}
              {genres.map((genre) => (
                <div
                  key={`${genre.id}|${genre.name}`}
                  id={`carousel-${genre.name.toLowerCase().replace(/ /g, "-")}`}
                  className=""
                >
                  {renderMovies(genreMovies[genre.id] || [], genre.name)}
                </div>
              ))}
            </div>
          </>
        )}

        {selectedCategory === "tvshows" && (
          <>
            <div className="flex items-center mt-10 mb-4">
              <Divider marginClass="mr-5" />
              <h1 className="text-4xl font-bold text-white mx-auto">Shows</h1>
              <Divider marginClass="ml-5" />
            </div>
            <div className="flex justify-center overflow-x-auto">
              {isMobile && (
                <div className="">
                  {renderScrollButton("tv-providers", "left")}
                </div>
              )}
              <div
                id="button-carousel-tv-providers"
                className="flex mb-0 overflow-x-auto scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                <div className="flex space-x-2 py-1">
                  {renderTvProviderButtons()}
                </div>
              </div>
              {isMobile && (
                <div className="">
                  {renderScrollButton("tv-providers", "right")}
                </div>
              )}
            </div>
            <div
              key={`carousel-tv-providers-${selectedProvider.id}`}
              id="carousel-tv-providers"
            >
              {selectedTVProvider.id ? (
                providerTVShows[selectedTVProvider.id] &&
                providerTVShows[selectedTVProvider.id].length > 0 ? (
                  renderMovies(
                    providerTVShows[selectedTVProvider.id],
                    `Popular Shows on ${selectedTVProvider.name}`,
                  )
                ) : (
                  <p className="text-center text-gray-600">
                    No shows available for {selectedTVProvider.name}.
                  </p>
                )
              ) : (
                <p className="text-center text-gray-600">
                  Please select a provider to view shows.
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-0 mt-4">
              {" "}
              {tvCategories.map((category) => (
                <div
                  key={category.name}
                  id={`tv-carousel-${category.name.toLowerCase().replace(/ /g, "-")}`}
                  className=""
                >
                  {renderMovies(
                    categoryShows[category.name] || [],
                    category.name,
                    true,
                  )}
                </div>
              ))}
              {tvGenres.map((genre) => (
                <div
                  key={`${genre.id}|${genre.name}`}
                  id={`tv-carousel-${genre.name.toLowerCase().replace(/ /g, "-")}`}
                  className=""
                >
                  {renderMovies(tvShowGenres[genre.id] || [], genre.name, true)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default DiscoverContent;
