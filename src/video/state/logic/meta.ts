import { useEffect, useState } from "react";

import { getPlayerState } from "../cache";
import { listenEvent, sendEvent, unlistenEvent } from "../events";
import { VideoPlayerMeta, VideoPlayerState } from "../types";

export type VideoMetaEvent = VideoPlayerMeta | null;

function getMetaFromState(state: VideoPlayerState): VideoMetaEvent {
  return state.meta
    ? {
        ...state.meta,
      }
    : null;
}

export function updateMeta(descriptor: string, state: VideoPlayerState) {
  sendEvent<VideoMetaEvent>(descriptor, "meta", getMetaFromState(state));
}

export function useMeta(descriptor: string): VideoMetaEvent {
  const state = getPlayerState(descriptor);
  const [data, setData] = useState<VideoMetaEvent>(getMetaFromState(state));

  useEffect(() => {
    function update(payload: CustomEvent<VideoMetaEvent>) {
      setData(payload.detail);
    }
    listenEvent(descriptor, "meta", update);
    return () => {
      unlistenEvent(descriptor, "meta", update);
    };
  }, [descriptor]);

  return data;
}
