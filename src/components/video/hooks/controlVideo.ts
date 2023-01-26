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

interface ShowData {
  current?: {
    episodeId: string;
    seasonId: string;
  };
  isSeries: boolean;
  seasons?: {
    id: string;
    number: number;
    title: string;
    episodes?: {
      id: string;
      number: number;
      title: string;
    }[];
  }[];
}

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
  setShowData(data: ShowData): void;
  setCurrentEpisode(sId: string, eId: string): void;
  startAirplay(): void;
  openPopout(id: string): void;
  closePopout(): void;
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
  setShowData: () => null,
  startAirplay: () => null,
  setCurrentEpisode: () => null,
  openPopout: () => null,
  closePopout: () => null,
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
    openPopout(id: string) {
      update((s) => ({ ...s, popout: id }));
    },
    closePopout() {
      update((s) => ({ ...s, popout: null }));
    },
    setShowData(data) {
      update((s) => ({ ...s, seasonData: data }));
    },
    setCurrentEpisode(sId: string, eId: string) {
      update((s) => ({
        ...s,
        seasonData: {
          ...s.seasonData,
          current: {
            seasonId: sId,
            episodeId: eId,
          },
        },
      }));
    },
    startAirplay() {
      const videoPlayer = player as any;
      if (videoPlayer.webkitShowPlaybackTargetPicker)
        videoPlayer.webkitShowPlaybackTargetPicker();
    },
    initPlayer(sourceUrl: string, sourceType: MWStreamType) {
      this.setVolume(getStoredVolume());

      if (sourceType === MWStreamType.HLS) {
        if (player.canPlayType("application/vnd.apple.mpegurl")) {
          player.src = sourceUrl;
        } else {
          // HLS support
          if (!Hls.isSupported()) {
            update((s) => ({
              ...s,
              error: {
                name: `Not supported`,
                description: "Your browser does not support HLS video",
              },
            }));
            return;
          }

          const hls = new Hls({ enableWorker: false });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              update((s) => ({
                ...s,
                error: {
                  name: `error ${data.details}`,
                  description: data.error?.message ?? "Something went wrong",
                },
              }));
            }
            console.error("HLS error", data);
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
