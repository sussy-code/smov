import { useEffect, useState } from "react";

import { getPlayerState } from "../cache";
import { listenEvent, sendEvent, unlistenEvent } from "../events";
import { VideoPlayerState, VideoPlayerTimeFormat } from "../types";

export type VideoInterfaceEvent = {
  popout: string | null;
  leftControlHovering: boolean;
  isFocused: boolean;
  isFullscreen: boolean;
  popoutBounds: null | DOMRect;
  volumeChangedWithKeybind: boolean;
  timeFormat: VideoPlayerTimeFormat;
};

function getInterfaceFromState(state: VideoPlayerState): VideoInterfaceEvent {
  return {
    popout: state.interface.popout,
    leftControlHovering: state.interface.leftControlHovering,
    isFocused: state.interface.isFocused,
    isFullscreen: state.interface.isFullscreen,
    popoutBounds: state.interface.popoutBounds,
    volumeChangedWithKeybind: state.interface.volumeChangedWithKeybind,
    timeFormat: state.interface.timeFormat,
  };
}

export function updateInterface(descriptor: string, state: VideoPlayerState) {
  sendEvent<VideoInterfaceEvent>(
    descriptor,
    "interface",
    getInterfaceFromState(state)
  );
}

export function useInterface(descriptor: string): VideoInterfaceEvent {
  const state = getPlayerState(descriptor);
  const [data, setData] = useState<VideoInterfaceEvent>(
    getInterfaceFromState(state)
  );

  useEffect(() => {
    function update(payload: CustomEvent<VideoInterfaceEvent>) {
      setData(payload.detail);
    }
    listenEvent(descriptor, "interface", update);
    return () => {
      unlistenEvent(descriptor, "interface", update);
    };
  }, [descriptor]);

  return data;
}
