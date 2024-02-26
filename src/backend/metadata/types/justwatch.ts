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

export type JWExternalIdType =
  | "eidr"
  | "imdb_latest"
  | "imdb"
  | "tmdb_latest"
  | "tmdb"
  | "tms";

export interface JWExternalId {
  provider: JWExternalIdType;
  external_id: string;
}

export interface JWDetailedMeta extends JWMediaResult {
  external_ids: JWExternalId[];
}
