/* Define shit here */

// Define the Media type
export interface Media {
  id: number;
  poster_path: string;
  title?: string;
  name?: string;
}

// Update the Movie and TVShow interfaces to extend the Media interface
export interface Movie extends Media {
  title: string;
}

export interface TVShow extends Media {
  name: string;
}

// Define the Genre type
export interface Genre {
  id: number;
  name: string;
}

// Define the Category type
export interface Category {
  name: string;
  endpoint: string;
}

// Define the categories
export const categories: Category[] = [
  {
    name: "Now Playing",
    endpoint: "/movie/now_playing?language=en-US",
  },
  {
    name: "Top Rated",
    endpoint: "/movie/top_rated?language=en-US",
  },
  {
    name: "Most Popular",
    endpoint: "/movie/popular?language=en-US",
  },
];

export const tvCategories: Category[] = [
  {
    name: "Top Rated",
    endpoint: "/tv/top_rated?language=en-US",
  },
  {
    name: "Most Popular",
    endpoint: "/tv/popular?language=en-US",
  },
];
