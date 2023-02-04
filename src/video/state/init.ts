import { nanoid } from "nanoid";
import { _players } from "./cache";
import { VideoPlayerState } from "./types";

function initPlayer(): VideoPlayerState {
  return {
    interface: {
      popout: null,
      isFullscreen: false,
      isFocused: false,
      leftControlHovering: false,
    },

    mediaPlaying: {
      isPlaying: false,
      isPaused: true,
      isLoading: false,
      isSeeking: false,
      isFirstLoading: true,
      hasPlayedOnce: false,
    },

    progress: {
      time: 0,
      duration: 0,
      buffered: 0,
    },

    meta: null,
    source: null,
    error: null,

    volume: 0,
    pausedWhenSeeking: false,
    hasInitialized: false,
    canAirplay: false,

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
