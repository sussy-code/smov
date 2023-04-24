import { useEffect, useState } from "react";

import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";

import { getPlayerState } from "../cache";
import { listenEvent, sendEvent, unlistenEvent } from "../events";
import { VideoPlayerState } from "../types";

export type VideoSourceEvent = {
  source: null | {
    quality: MWStreamQuality;
    url: string;
    type: MWStreamType;
    providerId?: string;
    embedId?: string;
    caption: null | {
      id: string;
      url: string;
    };
  };
};

function getSourceFromState(state: VideoPlayerState): VideoSourceEvent {
  return {
    source: state.source ? { ...state.source } : null,
  };
}

export function updateSource(descriptor: string, state: VideoPlayerState) {
  sendEvent<VideoSourceEvent>(descriptor, "source", getSourceFromState(state));
}

export function useSource(descriptor: string): VideoSourceEvent {
  const state = getPlayerState(descriptor);
  const [data, setData] = useState<VideoSourceEvent>(getSourceFromState(state));

  useEffect(() => {
    function update(payload: CustomEvent<VideoSourceEvent>) {
      setData(payload.detail);
    }
    listenEvent(descriptor, "source", update);
    return () => {
      unlistenEvent(descriptor, "source", update);
    };
  }, [descriptor]);

  return data;
}
