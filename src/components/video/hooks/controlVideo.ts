import Hls from "hls.js";
import {
  canChangeVolume,
  canFullscreen,
  canFullscreenAnyElement,
  canWebkitFullscreen,
} from "@/utils/detectFeatures";
import { MWStreamType } from "@/backend/helpers/streams";
import fscreen from "fscreen";
import React, { RefObject } from "react";
import { PlayerState } from "./useVideoPlayer";
import { getStoredVolume, setStoredVolume } from "./volumeStore";

export interface PlayerControls {
  play(): void;
  pause(): void;
  exitFullscreen(): void;
  enterFullscreen(): void;
  setTime(time: number): void;
  setVolume(volume: number): void;
  setSeeking(active: boolean): void;
  setLeftControlsHover(hovering: boolean): void;
  initPlayer(sourceUrl: string, sourceType: MWStreamType): void;
}

export const initialControls: PlayerControls = {
  play: () => null,
  pause: () => null,
  enterFullscreen: () => null,
  exitFullscreen: () => null,
  setTime: () => null,
  setVolume: () => null,
  setSeeking: () => null,
  setLeftControlsHover: () => null,
  initPlayer: () => null,
};

export function populateControls(
  playerEl: HTMLVideoElement,
  wrapperEl: HTMLDivElement,
  update: (s: React.SetStateAction<PlayerState>) => void,
  state: RefObject<PlayerState>
): PlayerControls {
  const player = playerEl;
  const wrapper = wrapperEl;

  return {
    play() {
      player.play();
    },
    pause() {
      player.pause();
    },
    enterFullscreen() {
      if (!canFullscreen() || fscreen.fullscreenElement) return;
      if (canFullscreenAnyElement()) {
        fscreen.requestFullscreen(wrapper);
        return;
      }
      if (canWebkitFullscreen()) {
        (player as any).webkitEnterFullscreen();
      }
    },
    exitFullscreen() {
      if (!fscreen.fullscreenElement) return;
      fscreen.exitFullscreen();
    },
    setTime(t) {
      // clamp time between 0 and max duration
      let time = Math.min(t, player.duration);
      time = Math.max(0, time);

      if (Number.isNaN(time)) return;

      // update state
      player.currentTime = time;
      update((s) => ({ ...s, time }));
    },
    async setVolume(v) {
      // clamp time between 0 and 1
      let volume = Math.min(v, 1);
      volume = Math.max(0, volume);

      // update state
      if (await canChangeVolume()) player.volume = volume;
      update((s) => ({ ...s, volume }));

      // update localstorage
      setStoredVolume(volume);
    },
    setSeeking(active) {
      const currentState = state.current;
      if (!currentState) return;

      // if it was playing when starting to seek, play again
      if (!active) {
        if (!currentState.pausedWhenSeeking) this.play();
        return;
      }

      // when seeking we pause the video
      update((s) => ({ ...s, pausedWhenSeeking: s.isPaused }));
      this.pause();
    },
    setLeftControlsHover(hovering) {
      update((s) => ({ ...s, leftControlHovering: hovering }));
    },
    initPlayer(sourceUrl: string, sourceType: MWStreamType) {
      this.setVolume(getStoredVolume());

      if (sourceType === MWStreamType.HLS) {
        if (player.canPlayType("application/vnd.apple.mpegurl")) {
          player.src = sourceUrl;
        } else {
          // HLS support
          if (!Hls.isSupported()) throw new Error("HLS not supported"); // TODO handle errors

          const hls = new Hls();

          hls.on(Hls.Events.ERROR, (event, data) => {
            // eslint-disable-next-line no-alert
            if (data.fatal) alert("HLS fatal error");
            console.error("HLS error", data); // TODO handle errors
          });

          hls.attachMedia(player);
          hls.loadSource(sourceUrl);
        }
      } else if (sourceType === MWStreamType.MP4) {
        player.src = sourceUrl;
      }
    },
  };
}
