export enum MWMediaType {
  MOVIE = "movie",
  SERIES = "series",
  ANIME = "anime",
}

export type MWMediaMeta = {
  title: string;
  id: string;
  year: string;
  poster?: string;
  type: MWMediaType;
};
