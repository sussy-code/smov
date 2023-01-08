import React, { MutableRefObject, useEffect, useState } from "react";
import {
  initialControls,
  PlayerControls,
  populateControls,
} from "./controlVideo";

export type PlayerState = {
  isPlaying: boolean;
  isPaused: boolean;
} & PlayerControls;

export const initialPlayerState = {
  isPlaying: false,
  isPaused: true,
  ...initialControls,
};

type SetPlayer = (s: React.SetStateAction<PlayerState>) => void;

function readState(player: HTMLVideoElement, update: SetPlayer) {
  const state = {
    ...initialPlayerState,
  };
  state.isPaused = player.paused;
  state.isPlaying = !player.paused;

  update(state);
}

function registerListeners(player: HTMLVideoElement, update: SetPlayer) {
  player.addEventListener("pause", () => {
    update((s) => ({ ...s, isPaused: true, isPlaying: false }));
  });
  player.addEventListener("play", () => {
    update((s) => ({ ...s, isPaused: false, isPlaying: true }));
  });
}

export function useVideoPlayer(ref: MutableRefObject<HTMLVideoElement | null>) {
  const [state, setState] = useState(initialPlayerState);

  useEffect(() => {
    const player = ref.current;
    if (player) {
      readState(player, setState);
      registerListeners(player, setState);
      setState((s) => ({ ...s, ...populateControls(player) }));
    }
  }, [ref]);

  return {
    playerState: state,
  };
}
