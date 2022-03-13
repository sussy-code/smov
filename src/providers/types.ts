export enum MWMediaType {
  MOVIE = "movie",
  SERIES = "series",
  ANIME = "anime",
}

export interface MWPortableMedia {
  mediaId: string;
  mediaType: MWMediaType;
  providerId: string;
  seasonId?: string;
  episodeId?: string;
}

export type MWMediaStreamType = "m3u8" | "mp4";
export interface MWMediaStream {
  url: string;
  type: MWMediaStreamType;
}

export interface MWMediaMeta extends MWPortableMedia {
  title: string;
  year: string;
  seasonCount?: number;
}

export interface MWMediaEpisode {
  sort: number;
  id: string;
  title: string;
}
export interface MWMediaSeason {
  sort: number;
  id: string;
  title?: string;
  type: "season" | "special";
  episodes: MWMediaEpisode[];
}
export interface MWMediaSeasons {
  seasons: MWMediaSeason[];
}

export interface MWMedia extends MWMediaMeta {
  seriesData?: MWMediaSeasons;
}

export type MWProviderMediaResult = Omit<MWMedia, "mediaType" | "providerId">;

export interface MWQuery {
  searchQuery: string;
  type: MWMediaType;
}

export interface MWMediaProvider {
  id: string; // id of provider, must be unique
  enabled: boolean;
  type: MWMediaType[];
  displayName: string;

  getMediaFromPortable(media: MWPortableMedia): Promise<MWProviderMediaResult>;
  searchForMedia(query: MWQuery): Promise<MWProviderMediaResult[]>;
  getStream(media: MWPortableMedia): Promise<MWMediaStream>;
  getSeasonDataFromMedia(media: MWPortableMedia): Promise<MWMediaSeasons>;
}

export interface MWMediaProviderMetadata {
  exists: boolean;
  id?: string;
  enabled: boolean;
  type: MWMediaType[];
  provider?: MWMediaProvider;
}

export interface MWMassProviderOutput {
  providers: {
    id: string;
    success: boolean;
  }[];
  results: MWMedia[];
  stats: {
    total: number;
    failed: number;
    succeeded: number;
  };
}
