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

export interface MWMedia extends MWPortableMedia {
  title: string;
  year: string;
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
}
