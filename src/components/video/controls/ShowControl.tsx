import { useEffect, useRef } from "react";
import { useVideoPlayerState } from "../VideoContext";

interface ShowControlProps {
  series?: {
    episodeId: string;
    seasonId: string;
  };
  onSelect?: (state: { episodeId?: string; seasonId?: string }) => void;
}

export function ShowControl(props: ShowControlProps) {
  const { videoState } = useVideoPlayerState();
  const lastState = useRef<{
    episodeId?: string;
    seasonId?: string;
  } | null>({
    episodeId: props.series?.episodeId,
    seasonId: props.series?.seasonId,
  });

  useEffect(() => {
    videoState.setShowData({
      current: props.series,
      isSeries: !!props.series,
    });
    // we only want it to run when props change, not when videoState changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    const currentState = {
      episodeId: videoState.seasonData.current?.episodeId,
      seasonId: videoState.seasonData.current?.seasonId,
    };
    if (
      currentState.episodeId !== lastState.current?.episodeId ||
      currentState.seasonId !== lastState.current?.seasonId
    ) {
      lastState.current = currentState;
      props.onSelect?.(currentState);
    }
  }, [videoState, props]);

  return null;
}
