import React, { MutableRefObject, useEffect, useState } from "react";
import {
  initialControls,
  PlayerControls,
  populateControls,
} from "./controlVideo";

export type PlayerState = {
  isPlaying: boolean;
  isPaused: boolean;
  isSeeking: boolean;
  isFullscreen: boolean;
} & PlayerControls;

export const initialPlayerState: PlayerState = {
  isPlaying: false,
  isPaused: true,
  isFullscreen: false,
  isSeeking: false,
  ...initialControls,
};

type SetPlayer = (s: React.SetStateAction<PlayerState>) => void;

function readState(player: HTMLVideoElement, update: SetPlayer) {
  const state = {
    ...initialPlayerState,
  };
  state.isPaused = player.paused;
  state.isPlaying = !player.paused;
  state.isFullscreen = !!document.fullscreenElement;
  state.isSeeking = player.seeking;

  update(state);
}

function registerListeners(player: HTMLVideoElement, update: SetPlayer) {
  player.addEventListener("pause", () => {
    update((s) => ({ ...s, isPaused: true, isPlaying: false }));
  });
  player.addEventListener("play", () => {
    update((s) => ({ ...s, isPaused: false, isPlaying: true }));
  });
  player.addEventListener("seeking", () => {
    update((s) => ({ ...s, isSeeking: true }));
  });
  player.addEventListener("seeked", () => {
    update((s) => ({ ...s, isSeeking: false }));
  });
  document.addEventListener("fullscreenchange", () => {
    update((s) => ({ ...s, isFullscreen: !!document.fullscreenElement }));
  });
}

export function useVideoPlayer(
  ref: MutableRefObject<HTMLVideoElement | null>,
  wrapperRef: MutableRefObject<HTMLDivElement | null>
) {
  const [state, setState] = useState(initialPlayerState);

  useEffect(() => {
    const player = ref.current;
    const wrapper = wrapperRef.current;
    if (player && wrapper) {
      readState(player, setState);
      registerListeners(player, setState);
      setState((s) => ({ ...s, ...populateControls(player, wrapper) }));
    }
  }, [ref, wrapperRef]);

  return {
    playerState: state,
  };
}
