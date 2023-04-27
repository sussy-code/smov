import { useEffect, useState } from "react";

import { getPlayerState } from "../cache";
import { listenEvent, sendEvent, unlistenEvent } from "../events";
import { VideoPlayerState } from "../types";

export type VideoProgressEvent = {
  time: number;
  duration: number;
  buffered: number;
  draggingTime: number;
};

function getProgressFromState(state: VideoPlayerState): VideoProgressEvent {
  return {
    time: state.progress.time,
    duration: state.progress.duration,
    buffered: state.progress.buffered,
    draggingTime: state.progress.draggingTime,
  };
}

export function updateProgress(descriptor: string, state: VideoPlayerState) {
  sendEvent<VideoProgressEvent>(
    descriptor,
    "progress",
    getProgressFromState(state)
  );
}

export function useProgress(descriptor: string): VideoProgressEvent {
  const state = getPlayerState(descriptor);
  const [data, setData] = useState<VideoProgressEvent>(
    getProgressFromState(state)
  );

  useEffect(() => {
    function update(payload: CustomEvent<VideoProgressEvent>) {
      setData(payload.detail);
    }
    listenEvent(descriptor, "progress", update);
    return () => {
      unlistenEvent(descriptor, "progress", update);
    };
  }, [descriptor]);

  return data;
}
