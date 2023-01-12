import { MWMediaMeta } from "@/backend/metadata/types";
import { MediaCard } from "./MediaCard";

export interface WatchedMediaCardProps {
  media: MWMediaMeta;
}

export function WatchedMediaCard(props: WatchedMediaCardProps) {
  return <MediaCard media={props.media} linkable />;
}
