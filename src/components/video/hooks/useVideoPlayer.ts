import { canChangeVolume } from "@/utils/detectFeatures";
import fscreen from "fscreen";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
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
  isLoading: boolean;
  isFirstLoading: boolean;
  isFullscreen: boolean;
  time: number;
  duration: number;
  volume: number;
  buffered: number;
  pausedWhenSeeking: boolean;
  hasInitialized: boolean;
  leftControlHovering: boolean;
  hasPlayedOnce: boolean;
  popout: string | null;
  seasonData: {
    isSeries: boolean;
    current?: {
      episodeId: string;
      seasonId: string;
    };
    seasons?: {
      id: string;
      number: number;
      title: string;
      episodes?: { id: string; number: number; title: string }[];
    }[];
  };
  error: null | {
    name: string;
    description: string;
  };
  canAirplay: boolean;
};

export type PlayerContext = PlayerState & PlayerControls;

export const initialPlayerState: PlayerContext = {
  isPlaying: false,
  isPaused: true,
  isFullscreen: false,
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
  ...initialControls,
};

type SetPlayer = (s: React.SetStateAction<PlayerContext>) => void;

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
  state.isLoading = false;
  state.hasInitialized = true;
  state.error = null;

  update((s) => ({
    ...state,
    pausedWhenSeeking: s.pausedWhenSeeking,
    hasPlayedOnce: s.hasPlayedOnce,
    isFirstLoading: s.isFirstLoading,
  }));
}

function registerListeners(player: HTMLVideoElement, update: SetPlayer) {
  const pause = () => {
    update((s) => ({
      ...s,
      isPaused: true,
      isPlaying: false,
    }));
  };
  const playing = () => {
    update((s) => ({
      ...s,
      isPaused: false,
      isPlaying: true,
      isLoading: false,
      hasPlayedOnce: true,
    }));
  };
  const seeking = () => {
    update((s) => ({ ...s, isSeeking: true }));
  };
  const seeked = () => {
    update((s) => ({ ...s, isSeeking: false }));
  };
  const waiting = () => {
    update((s) => ({ ...s, isLoading: true }));
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
  const volumechange = async () => {
    if (await canChangeVolume())
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
  const canplay = () => {
    update((s) => ({
      ...s,
      isFirstLoading: false,
    }));
  };
  const error = () => {
    console.error("Native video player threw error", player.error);
    update((s) => ({
      ...s,
      error: player.error
        ? {
            description: player.error.message,
            name: `Error ${player.error.code}`,
          }
        : null,
    }));
  };
  const canAirplay = (e: any) => {
    if (e.availability === "available") {
      update((s) => ({
        ...s,
        canAirplay: true,
      }));
    }
  };

  player.addEventListener("pause", pause);
  player.addEventListener("playing", playing);
  player.addEventListener("seeking", seeking);
  player.addEventListener("seeked", seeked);
  fscreen.addEventListener("fullscreenchange", fullscreenchange);
  player.addEventListener("timeupdate", timeupdate);
  player.addEventListener("loadedmetadata", loadedmetadata);
  player.addEventListener("volumechange", volumechange);
  player.addEventListener("progress", progress);
  player.addEventListener("waiting", waiting);
  player.addEventListener("canplay", canplay);
  player.addEventListener("error", error);
  player.addEventListener(
    "webkitplaybacktargetavailabilitychanged",
    canAirplay
  );

  return () => {
    player.removeEventListener("pause", pause);
    player.removeEventListener("playing", playing);
    player.removeEventListener("seeking", seeking);
    player.removeEventListener("seeked", seeked);
    fscreen.removeEventListener("fullscreenchange", fullscreenchange);
    player.removeEventListener("timeupdate", timeupdate);
    player.removeEventListener("loadedmetadata", loadedmetadata);
    player.removeEventListener("volumechange", volumechange);
    player.removeEventListener("progress", progress);
    player.removeEventListener("waiting", waiting);
    player.removeEventListener("canplay", canplay);
    player.removeEventListener("error", error);
    player.removeEventListener(
      "webkitplaybacktargetavailabilitychanged",
      canAirplay
    );
  };
}

export function useVideoPlayer(
  ref: MutableRefObject<HTMLVideoElement | null>,
  wrapperRef: MutableRefObject<HTMLDivElement | null>
) {
  const [state, setState] = useState(initialPlayerState);
  const stateRef = useRef<PlayerState | null>(null);

  useEffect(() => {
    const player = ref.current;
    const wrapper = wrapperRef.current;
    if (player && wrapper) {
      readState(player, setState);
      registerListeners(player, setState);
      setState((s) => ({
        ...s,
        ...populateControls(player, wrapper, setState as any, stateRef),
      }));
    }
  }, [ref, wrapperRef, stateRef]);

  useEffect(() => {
    stateRef.current = state;
  }, [state, stateRef]);

  return {
    playerState: state,
  };
}
