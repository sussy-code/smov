export enum MWMediaType {
  MOVIE = "movie",
  SERIES = "series",
  ANIME = "anime",
}

export type MWSeasonMeta = {
  id: string;
  number: number;
  title: string;
};

export type MWSeasonWithEpisodeMeta = {
  id: string;
  number: number;
  title: string;
  episodes: {
    id: string;
    number: number;
    title: string;
  }[];
};

type MWMediaMetaBase = {
  title: string;
  id: string;
  year?: string;
  poster?: string;
};

type MWMediaMetaSpecific =
  | {
      type: MWMediaType.MOVIE | MWMediaType.ANIME;
      seasons: undefined;
    }
  | {
      type: MWMediaType.SERIES;
      seasons: MWSeasonMeta[];
      seasonData: MWSeasonWithEpisodeMeta;
    };

export type MWMediaMeta = MWMediaMetaBase & MWMediaMetaSpecific;

export interface MWQuery {
  searchQuery: string;
  type: MWMediaType;
}

export type TMDBContentTypes = "movie" | "show";

export type TMDBSeasonShort = {
  title: string;
  id: number;
  season_number: number;
};

export type TMDBEpisodeShort = {
  title: string;
  id: number;
  episode_number: number;
};

export type TMDBMediaResult = {
  title: string;
  poster?: string;
  id: number;
  original_release_year?: number;
  object_type: TMDBContentTypes;
  seasons?: TMDBSeasonShort[];
};

export type TMDBSeasonMetaResult = {
  title: string;
  id: string;
  season_number: number;
  episodes: TMDBEpisodeShort[];
};

export interface DetailedMeta {
  meta: MWMediaMeta;
  imdbId?: string;
  tmdbId?: string;
}

export interface TMDBShowData {
  adult: boolean;
  backdrop_path: string | null;
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  first_air_date: string;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    production_code: string;
    runtime: number | null;
    season_number: number;
    show_id: number;
    still_path: string | null;
  } | null;
  name: string;
  next_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    production_code: string;
    runtime: number | null;
    season_number: number;
    show_id: number;
    still_path: string | null;
  } | null;
  networks: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface TMDBMovieData {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type TMDBMediaDetailsPromise = Promise<TMDBShowData | TMDBMovieData>;

export interface TMDBMediaStatic {
  getMediaDetails(id: string, type: "show"): TMDBMediaDetailsPromise;
  getMediaDetails(id: string, type: "movie"): TMDBMediaDetailsPromise;
  getMediaDetails(id: string, type: TMDBContentTypes): TMDBMediaDetailsPromise;
}

export type JWContentTypes = "movie" | "show";

export type JWSearchQuery = {
  content_types: JWContentTypes[];
  page: number;
  page_size: number;
  query: string;
};

export type JWPage<T> = {
  items: T[];
  page: number;
  page_size: number;
  total_pages: number;
  total_results: number;
};

export const JW_API_BASE = "https://apis.justwatch.com";
export const JW_IMAGE_BASE = "https://images.justwatch.com";

export type JWSeasonShort = {
  title: string;
  id: number;
  season_number: number;
};

export type JWEpisodeShort = {
  title: string;
  id: number;
  episode_number: number;
};

export type JWMediaResult = {
  title: string;
  poster?: string;
  id: number;
  original_release_year?: number;
  jw_entity_id: string;
  object_type: JWContentTypes;
  seasons?: JWSeasonShort[];
};

export type JWSeasonMetaResult = {
  title: string;
  id: string;
  season_number: number;
  episodes: JWEpisodeShort[];
};

export interface TMDBEpisodeResult {
  season: number;
  number: number;
  title: string;
  ids: {
    trakt: number;
    tvdb: number;
    imdb: string;
    tmdb: number;
  };
}

export interface TMDBShowResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface TMDBShowResponse {
  page: number;
  results: TMDBShowResult[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBMovieResponse {
  page: number;
  results: TMDBMovieResult[];
  total_pages: number;
  total_results: number;
}

export type TMDBSearchResultsPromise = Promise<
  TMDBShowResponse | TMDBMovieResponse
>;

export interface TMDBSearchResultStatic {
  searchMedia(query: string, type: TMDBContentTypes): TMDBSearchResultsPromise;
  searchMedia(query: string, type: "movie"): TMDBSearchResultsPromise;
  searchMedia(query: string, type: "show"): TMDBSearchResultsPromise;
}

export interface TMDBEpisode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  crew: any[];
  guest_stars: any[];
}

export interface TMDBSeason {
  _id: string;
  air_date: string;
  episodes: TMDBEpisode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}
