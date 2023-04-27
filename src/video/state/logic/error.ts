import { useEffect, useState } from "react";

import { getPlayerState } from "../cache";
import { listenEvent, sendEvent, unlistenEvent } from "../events";
import { VideoPlayerState } from "../types";

export type VideoErrorEvent = {
  error: null | {
    name: string;
    description: string;
  };
};

function getErrorFromState(state: VideoPlayerState): VideoErrorEvent {
  return {
    error: state.error,
  };
}

export function updateError(descriptor: string, state: VideoPlayerState) {
  sendEvent<VideoErrorEvent>(descriptor, "error", getErrorFromState(state));
}

export function useError(descriptor: string): VideoErrorEvent {
  const state = getPlayerState(descriptor);
  const [data, setData] = useState<VideoErrorEvent>(getErrorFromState(state));

  useEffect(() => {
    function update(payload: CustomEvent<VideoErrorEvent>) {
      setData(payload.detail);
    }
    listenEvent(descriptor, "error", update);
    return () => {
      unlistenEvent(descriptor, "error", update);
    };
  }, [descriptor]);

  return data;
}
