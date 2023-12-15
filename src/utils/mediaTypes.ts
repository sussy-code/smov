export interface MediaItem {
  id: string;
  title: string;
  year?: number;
  poster?: string;
  type: "show" | "movie";
}
