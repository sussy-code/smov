import { useMemo } from "react";

import { MWMediaMeta } from "@/backend/metadata/types/mw";
import { useWatchedContext } from "@/state/watched";

import { MediaCard } from "./MediaCard";

export interface WatchedMediaCardProps {
  media: MWMediaMeta;
  closable?: boolean;
  onClose?: () => void;
}

function formatSeries(
  obj:
    | { episodeId: string; seasonId: string; episode: number; season: number }
    | undefined
) {
  if (!obj) return undefined;
  return {
    season: obj.season,
    episode: obj.episode,
    episodeId: obj.episodeId,
    seasonId: obj.seasonId,
  };
}

export function WatchedMediaCard(props: WatchedMediaCardProps) {
  const { watched } = useWatchedContext();
  const watchedMedia = useMemo(() => {
    return watched.items
      .sort((a, b) => b.watchedAt - a.watchedAt)
      .find((v) => v.item.meta.id === props.media.id);
  }, [watched, props.media]);

  return (
    <MediaCard
      media={props.media}
      series={formatSeries(watchedMedia?.item?.series)}
      linkable
      percentage={watchedMedia?.percentage}
      onClose={props.onClose}
      closable={props.closable}
    />
  );
}
