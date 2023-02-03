import { useEffect, useState } from "react";
import { getPlayerState } from "../cache";
import { listenEvent, sendEvent, unlistenEvent } from "../events";
import { VideoPlayerState } from "../types";

export type VideoMediaPlayingEvent = {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isSeeking: boolean;
  hasPlayedOnce: boolean;
  isFirstLoading: boolean;
};

function getMediaPlayingFromState(
  state: VideoPlayerState
): VideoMediaPlayingEvent {
  return {
    hasPlayedOnce: state.hasPlayedOnce,
    isLoading: state.isLoading,
    isPaused: state.isPaused,
    isPlaying: state.isPlaying,
    isSeeking: state.isSeeking,
    isFirstLoading: state.isFirstLoading,
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
