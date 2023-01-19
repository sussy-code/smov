import { MWMediaMeta } from "@/backend/metadata/types";
import { useWatchedContext } from "@/state/watched";
import { useMemo } from "react";
import { MediaCard } from "./MediaCard";

export interface WatchedMediaCardProps {
  media: MWMediaMeta;
  closable?: boolean;
  onClose?: () => void;
}

export function WatchedMediaCard(props: WatchedMediaCardProps) {
  const { watched } = useWatchedContext();
  const watchedMedia = useMemo(() => {
    return watched.items.find((v) => v.item.meta.id === props.media.id);
  }, [watched, props.media]);

  return (
    <MediaCard
      media={props.media}
      series={watchedMedia?.item?.series}
      linkable
      percentage={watchedMedia?.percentage}
      onClose={props.onClose}
      closable={props.closable}
    />
  );
}
