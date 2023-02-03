import {
  MWSeasonMeta,
  MWSeasonWithEpisodeMeta,
} from "@/backend/metadata/types";
import { useEffect, useRef } from "react";
import { PlayerContext } from "../hooks/useVideoPlayer";
import { useVideoPlayerState } from "../VideoContext";

interface ShowControlProps {
  series?: {
    episodeId: string;
    seasonId: string;
  };
  seasons: MWSeasonMeta[];
  seasonData: MWSeasonWithEpisodeMeta;
  onSelect?: (state: { episodeId?: string; seasonId?: string }) => void;
}

function setVideoShowState(videoState: PlayerContext, props: ShowControlProps) {
  const seasonsWithEpisodes = props.seasons.map((v) => {
    if (v.id === props.seasonData.id)
      return {
        ...v,
        episodes: props.seasonData.episodes,
      };
    return v;
  });

  videoState.setShowData({
    current: props.series,
    isSeries: !!props.series,
    seasons: seasonsWithEpisodes,
  });
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

  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current) return;
    if (!videoState.hasInitialized) return;
    setVideoShowState(videoState, props);
    hasInitialized.current = true;
  }, [props, videoState]);

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
