import { MWSearchResult } from "@/backend/metadata/search";
import { MediaCard } from "./MediaCard";

export interface WatchedMediaCardProps {
  media: MWSearchResult;
}

export function WatchedMediaCard(props: WatchedMediaCardProps) {
  return <MediaCard media={props.media} linkable />;
}
