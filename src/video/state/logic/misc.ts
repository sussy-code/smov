import { useEffect, useState } from "react";

import { getPlayerState } from "../cache";
import { listenEvent, sendEvent, unlistenEvent } from "../events";
import { VideoPlayerState } from "../types";

export type VideoMiscError = {
  canAirplay: boolean;
  wrapperInitialized: boolean;
  initalized: boolean;
  isCasting: boolean;
  stateProviderId: string;
};

function getMiscFromState(state: VideoPlayerState): VideoMiscError {
  return {
    canAirplay: state.canAirplay,
    wrapperInitialized: !!state.wrapperElement,
    initalized: state.initalized,
    isCasting: state.casting.isCasting,
    stateProviderId: state.stateProviderId,
  };
}

export function updateMisc(descriptor: string, state: VideoPlayerState) {
  sendEvent<VideoMiscError>(descriptor, "misc", getMiscFromState(state));
}

export function useMisc(descriptor: string): VideoMiscError {
  const state = getPlayerState(descriptor);
  const [data, setData] = useState<VideoMiscError>(getMiscFromState(state));

  useEffect(() => {
    function update(payload: CustomEvent<VideoMiscError>) {
      setData(payload.detail);
    }
    listenEvent(descriptor, "misc", update);
    return () => {
      unlistenEvent(descriptor, "misc", update);
    };
  }, [descriptor]);

  return data;
}
