import { nanoid } from "nanoid";
import { _players } from "./cache";
import { VideoPlayerState } from "./types";

function initPlayer(): VideoPlayerState {
  return {
    isPlaying: false,
    isPaused: true,
    isFullscreen: false,
    isFocused: false,
    isLoading: false,
    isSeeking: false,
    isFirstLoading: true,
    time: 0,
    duration: 0,
    volume: 0,
    buffered: 0,
    pausedWhenSeeking: false,
    hasInitialized: false,
    leftControlHovering: false,
    hasPlayedOnce: false,
    error: null,
    popout: null,
    seasonData: {
      isSeries: false,
    },
    canAirplay: false,
    stateProvider: null,
    source: null,
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
