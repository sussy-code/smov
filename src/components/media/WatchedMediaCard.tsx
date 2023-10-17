import { useMemo } from "react";

import { ProgressMediaItem, useProgressStore } from "@/stores/progress";
import { MediaItem } from "@/utils/mediaTypes";

import { MediaCard } from "./MediaCard";

export interface WatchedMediaCardProps {
  media: MediaItem;
  closable?: boolean;
  onClose?: () => void;
}

function formatSeries(obj: ProgressMediaItem | undefined) {
  if (!obj) return undefined;
  if (obj.type !== "show") return;
  // TODO only show latest episode watched
  const ep = Object.values(obj.episodes)[0];
  const season = obj.seasons[ep?.seasonId];
  if (!ep || !season) return;
  return {
    season: season.number,
    episode: ep.number,
    episodeId: ep.id,
    seasonId: ep.seasonId,
    progress: ep.progress,
  };
}

export function WatchedMediaCard(props: WatchedMediaCardProps) {
  const progressItems = useProgressStore((s) => s.items);
  const item = useMemo(() => {
    return progressItems[props.media.id];
  }, [progressItems, props.media]);
  const series = useMemo(() => formatSeries(item), [item]);
  const progress = item?.progress ?? series?.progress;
  const percentage = progress
    ? (progress.watched / progress.duration) * 100
    : undefined;

  return (
    <MediaCard
      media={props.media}
      series={series}
      linkable
      percentage={percentage}
      onClose={props.onClose}
      closable={props.closable}
    />
  );
}
