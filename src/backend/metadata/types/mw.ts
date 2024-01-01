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
    air_date: string;
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
}

export interface DetailedMeta {
  meta: MWMediaMeta;
  imdbId?: string;
  tmdbId?: string;
}
