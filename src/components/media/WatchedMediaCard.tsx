import { MWMedia } from "providers";
import { useWatchedContext, getWatchedFromPortable } from "state/watched";
import { MediaCard } from "./MediaCard";

export interface WatchedMediaCardProps {
  media: MWMedia;
}

export function WatchedMediaCard(props: WatchedMediaCardProps) {
  const { watched } = useWatchedContext();
  const foundWatched = getWatchedFromPortable(watched, props.media);
  const watchedPercentage = (foundWatched && foundWatched.percentage) || 0;

  return (
    <MediaCard
      watchedPercentage={watchedPercentage}
      media={props.media}
      linkable
    />
  );
}
