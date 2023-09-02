import { nanoid } from "nanoid";

import { _players } from "./cache";
import { VideoPlayerState } from "./types";

export function resetForSource(s: VideoPlayerState) {
  const state = s;
  state.mediaPlaying = {
    isPlaying: false,
    isPaused: true,
    isLoading: false,
    isSeeking: false,
    isDragSeeking: false,
    isFirstLoading: true,
    hasPlayedOnce: false,
    volume: state.mediaPlaying.volume, // volume settings needs to persist through resets
    playbackSpeed: 1,
  };
  state.progress = {
    time: 0,
    duration: 0,
    buffered: 0,
    draggingTime: 0,
  };
  state.initalized = false;
}

function initPlayer(): VideoPlayerState {
  return {
    interface: {
      popout: null,
      isFullscreen: false,
      isFocused: false,
      leftControlHovering: false,
      popoutBounds: null,
      volumeChangedWithKeybind: false,
      volumeChangedWithKeybindDebounce: null,
      timeFormat: 0,
    },

    mediaPlaying: {
      isPlaying: false,
      isPaused: true,
      isLoading: false,
      isSeeking: false,
      isDragSeeking: false,
      isFirstLoading: true,
      hasPlayedOnce: false,
      volume: 0,
      playbackSpeed: 1,
    },

    progress: {
      time: 0,
      duration: 0,
      buffered: 0,
      draggingTime: 0,
    },

    casting: {
      isCasting: false,
      controller: null,
      instance: null,
      player: null,
    },

    meta: null,
    source: null,

    error: null,
    canAirplay: false,
    initalized: false,
    stateProviderId: "video",

    pausedWhenSeeking: false,
    hlsInstance: null,
    stateProvider: null,
    wrapperElement: null,
  };
}

export function registerVideoPlayer(): string {
  const id = nanoid();

  if (_players.has(id)) {
    throw new Error("duplicate id");
  }

  _players.set(id, initPlayer());
  return id;
}

export function unregisterVideoPlayer(id: string) {
  if (_players.has(id)) _players.delete(id);
}
