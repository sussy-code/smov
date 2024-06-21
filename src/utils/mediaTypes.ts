export interface MediaItem {
  seasons: import("c:/Users/huzei/OneDrive/Desktop/Sudo-Flix/src/backend/metadata/types/mw").MWSeasonMeta[];
  id: string;
  title: string;
  year?: number;
  release_date?: Date;
  poster?: string;
  type: "show" | "movie";
}
