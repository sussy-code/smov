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

export type TTVContentTypes = "movie" | "show";

export type TTVSeasonShort = {
  title: string;
  id: number;
  season_number: number;
};

export type TTVEpisodeShort = {
  title: string;
  id: number;
  episode_number: number;
};

export type TTVMediaResult = {
  title: string;
  poster?: string;
  id: number;
  original_release_year?: number;
  ttv_entity_id: string;
  object_type: TTVContentTypes;
  seasons?: TTVSeasonShort[];
};

export type TTVSeasonMetaResult = {
  title: string;
  id: string;
  season_number: number;
  episodes: TTVEpisodeShort[];
};

export interface TTVSearchResult {
  type: "movie" | "show";
  score: number;
  movie?: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      imdb: string;
      tmdb: number;
    };
  };
  show?: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      tvdb: number;
      imdb: string;
      tmdb: number;
    };
  };
}

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
  getMediaDetails(
    id: string,
    type: MWMediaType.SERIES
  ): TMDBMediaDetailsPromise;
  getMediaDetails(id: string, type: MWMediaType.MOVIE): TMDBMediaDetailsPromise;
  getMediaDetails(id: string, type: MWMediaType): TMDBMediaDetailsPromise;
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
