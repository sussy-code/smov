import React, { MutableRefObject, useEffect, useState } from "react";
import {
  initialControls,
  PlayerControls,
  populateControls,
} from "./controlVideo";
import { handleBuffered } from "./utils";

export type PlayerState = {
  isPlaying: boolean;
  isPaused: boolean;
  isSeeking: boolean;
  isFullscreen: boolean;
  time: number;
  duration: number;
  volume: number;
  buffered: number;
} & PlayerControls;

export const initialPlayerState: PlayerState = {
  isPlaying: false,
  isPaused: true,
  isFullscreen: false,
  isSeeking: false,
  time: 0,
  duration: 0,
  volume: 0,
  buffered: 0,
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
  state.time = player.currentTime;
  state.duration = player.duration;
  state.volume = player.volume;
  state.buffered = handleBuffered(player.currentTime, player.buffered);

  update(state);
}

function registerListeners(player: HTMLVideoElement, update: SetPlayer) {
  const pause = () => {
    update((s) => ({ ...s, isPaused: true, isPlaying: false }));
  };
  const play = () => {
    update((s) => ({ ...s, isPaused: false, isPlaying: true }));
  };
  const seeking = () => {
    update((s) => ({ ...s, isSeeking: true }));
  };
  const seeked = () => {
    update((s) => ({ ...s, isSeeking: false }));
  };
  const fullscreenchange = () => {
    update((s) => ({ ...s, isFullscreen: !!document.fullscreenElement }));
  };
  const timeupdate = () => {
    update((s) => ({
      ...s,
      duration: player.duration,
      time: player.currentTime,
    }));
  };
  const loadedmetadata = () => {
    update((s) => ({
      ...s,
      duration: player.duration,
    }));
  };
  const volumechange = () => {
    update((s) => ({
      ...s,
      volume: player.volume,
    }));
  };
  const progress = () => {
    update((s) => ({
      ...s,
      buffered: handleBuffered(player.currentTime, player.buffered),
    }));
  };

  player.addEventListener("pause", pause);
  player.addEventListener("play", play);
  player.addEventListener("seeking", seeking);
  player.addEventListener("seeked", seeked);
  document.addEventListener("fullscreenchange", fullscreenchange);
  player.addEventListener("timeupdate", timeupdate);
  player.addEventListener("loadedmetadata", loadedmetadata);
  player.addEventListener("volumechange", volumechange);
  player.addEventListener("progress", progress);

  return () => {
    player.removeEventListener("pause", pause);
    player.removeEventListener("play", play);
    player.removeEventListener("seeking", seeking);
    player.removeEventListener("seeked", seeked);
    document.removeEventListener("fullscreenchange", fullscreenchange);
    player.removeEventListener("timeupdate", timeupdate);
    player.removeEventListener("loadedmetadata", loadedmetadata);
    player.removeEventListener("volumechange", volumechange);
    player.removeEventListener("progress", progress);
  };
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
