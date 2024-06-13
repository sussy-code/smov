// mediaUtils.ts
import { Media } from "@/utils/discover";
import { MediaItem } from "@/utils/mediaTypes";

export function convertToMediaItem(
  media: Media,
  type: "movie" | "show",
): MediaItem {
  return {
    id: media.id.toString(),
    title: media.title || media.name || "Untitled",
    poster: `https://image.tmdb.org/t/p/w342/${media.poster_path}`,
    type,
    year: undefined, // You can set this based on your requirements
    release_date: undefined, // You can set this based on your requirements
  };
}
