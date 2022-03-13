import { MWMediaMeta } from "providers";
import { useWatchedContext, getWatchedFromPortable } from "state/watched";
import { MediaCard } from "./MediaCard";

export interface WatchedMediaCardProps {
  media: MWMediaMeta;
  series?: boolean;
}

export function WatchedMediaCard(props: WatchedMediaCardProps) {
  const { watched } = useWatchedContext();
  const foundWatched = getWatchedFromPortable(watched.items, props.media);
  const watchedPercentage = (foundWatched && foundWatched.percentage) || 0;

  return (
    <MediaCard
      watchedPercentage={watchedPercentage}
      media={props.media}
      series={props.series && props.media.episode !== undefined}
      linkable
    />
  );
}
