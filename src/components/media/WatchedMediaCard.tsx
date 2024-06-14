import { useCallback, useEffect, useMemo, useState } from "react";

import { usePlayerStore } from "@/stores/player/store";
import { useProgressStore } from "@/stores/progress";
import {
  ShowProgressResult,
  shouldShowProgress,
} from "@/stores/progress/utils";
import { MediaItem } from "@/utils/mediaTypes";

import { MediaCard } from "./MediaCard";
import { PopupModal } from "./PopupModal";

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

  const currentTitle = usePlayerStore((state) => state.playingTitle);
  const [playingTitle, setPlayingTitleState] = useState(currentTitle);

  useEffect(() => {
    setPlayingTitleState(currentTitle);
  }, [currentTitle]);

  const setPlayingTitle = usePlayerStore((state) => state.setPlayingTitle);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleClick = useCallback(() => {
    setPlayingTitle(props.media.id, props.media.title, props.media.type);
    setIsPopupVisible(!isPopupVisible);
  }, [
    setPlayingTitle,
    isPopupVisible,
    props.media.id,
    props.media.title,
    props.media.type,
  ]);

  return (
    <>
      <MediaCard
        media={props.media}
        series={formatSeries(itemToDisplay)}
        linkable
        percentage={percentage}
        onClose={props.onClose}
        closable={props.closable}
        onClick={handleClick}
      />
      <PopupModal
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        playingTitle={currentTitle}
        media={props.media}
      />
    </>
  );
}
