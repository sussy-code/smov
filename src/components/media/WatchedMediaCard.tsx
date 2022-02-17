import { MWMedia } from "scrapers";
import { MediaCard } from "./MediaCard";

export interface WatchedMediaCardProps {
  media: MWMedia;
}

export function WatchedMediaCard(props: WatchedMediaCardProps) {
  return <MediaCard watchedPercentage={0} media={props.media} linkable />;
}
