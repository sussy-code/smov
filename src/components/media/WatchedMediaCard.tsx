import { useMemo } from "react";

import { useProgressStore } from "@/stores/progress";
import {
  ShowProgressResult,
  shouldShowProgress,
} from "@/stores/progress/utils";
import { MediaItem } from "@/utils/mediaTypes";

import { MediaCard } from "./MediaCard";

function formatSeries(series?: ShowProgressResult | null) {
  if (!series || !series.episode || !series.season) return undefined;
  return {
    episode: series.episode?.number,
    season: series.season?.number,
    episodeId: series.episode?.id,
    seasonId: series.season?.id,
  };
}

export interface WatchedMediaCardProps {
  media: MediaItem;
  closable?: boolean;
  onClose?: () => void;
}

export function WatchedMediaCard(props: WatchedMediaCardProps) {
  const progressItems = useProgressStore((s) => s.items);
  const item = useMemo(() => {
    return progressItems[props.media.id];
  }, [progressItems, props.media]);
  const itemToDisplay = useMemo(
    () => (item ? shouldShowProgress(item) : null),
    [item],
  );
  const percentage = itemToDisplay?.show
    ? (itemToDisplay.progress.watched / itemToDisplay.progress.duration) * 100
    : undefined;

  return (
    <MediaCard
      media={props.media}
      series={formatSeries(itemToDisplay)}
      linkable
      percentage={percentage}
      onClose={props.onClose}
      closable={props.closable}
    />
  );
}
