export enum MWMediaType {
  MOVIE = "movie",
  SERIES = "series",
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
  type: MWMediaType,

  getMediaFromPortable(media: MWPortableMedia): MWMedia,
  searchForMedia(query: MWQuery): MWMedia[],
}
