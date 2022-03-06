export enum MWMediaType {
  MOVIE = "movie",
  SERIES = "series",
  ANIME = "anime",
}

export interface MWPortableMedia {
  mediaId: string;
  mediaType: MWMediaType;
  providerId: string;
  season?: number;
  episode?: number;
}

export type MWMediaStreamType = "m3u8" | "mp4";
export interface MWMediaStream {
  url: string;
  type: MWMediaStreamType;
}

export interface MWMediaMeta extends MWPortableMedia {
  title: string;
  year: string;
}

export interface MWMedia extends MWMediaMeta {}

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
