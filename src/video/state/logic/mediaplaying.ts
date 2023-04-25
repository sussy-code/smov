import { useEffect, useState } from "react";

import { getPlayerState } from "../cache";
import { listenEvent, sendEvent, unlistenEvent } from "../events";
import { VideoPlayerState } from "../types";

export type VideoMediaPlayingEvent = {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isSeeking: boolean;
  isDragSeeking: boolean;
  hasPlayedOnce: boolean;
  isFirstLoading: boolean;
  volume: number;
  playbackSpeed: number;
};

function getMediaPlayingFromState(
  state: VideoPlayerState
): VideoMediaPlayingEvent {
  return {
    hasPlayedOnce: state.mediaPlaying.hasPlayedOnce,
    isLoading: state.mediaPlaying.isLoading,
    isPaused: state.mediaPlaying.isPaused,
    isPlaying: state.mediaPlaying.isPlaying,
    isSeeking: state.mediaPlaying.isSeeking,
    isDragSeeking: state.mediaPlaying.isDragSeeking,
    isFirstLoading: state.mediaPlaying.isFirstLoading,
    volume: state.mediaPlaying.volume,
    playbackSpeed: state.mediaPlaying.playbackSpeed,
  };
}

export function updateMediaPlaying(
  descriptor: string,
  state: VideoPlayerState
) {
  sendEvent<VideoMediaPlayingEvent>(
    descriptor,
    "mediaplaying",
    getMediaPlayingFromState(state)
  );
}

export function useMediaPlaying(descriptor: string): VideoMediaPlayingEvent {
  const state = getPlayerState(descriptor);
  const [data, setData] = useState<VideoMediaPlayingEvent>(
    getMediaPlayingFromState(state)
  );

  useEffect(() => {
    function update(payload: CustomEvent<VideoMediaPlayingEvent>) {
      setData(payload.detail);
    }
    listenEvent(descriptor, "mediaplaying", update);
    return () => {
      unlistenEvent(descriptor, "mediaplaying", update);
    };
  }, [descriptor]);

  return data;
}
