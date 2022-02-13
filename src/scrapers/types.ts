export enum MWMediaType {
  MOVIE = "movie",
  SERIES = "series",
  ANIME = "anime",
}

export interface MWPortableMedia {
  mediaId: string,
  providerId: string,
}

export interface MWMedia extends MWPortableMedia {
  title: string,
}

export interface MWQuery {
  searchQuery: string,
  type: MWMediaType,
}

export interface MWMediaProvider {
  id: string, // id of provider, must be unique
  enabled: boolean,
  type: MWMediaType,
  displayName: string,

  getMediaFromPortable(media: MWPortableMedia): Promise<MWMedia>,
  searchForMedia(query: MWQuery): Promise<MWMedia[]>,
}
