import Hls from "hls.js";
import fscreen from "fscreen";
import {
  canFullscreen,
  canFullscreenAnyElement,
  canWebkitFullscreen,
} from "@/utils/detectFeatures";
import { MWStreamType } from "@/backend/helpers/streams";
import { updateInterface } from "@/video/state/logic/interface";
import { updateSource } from "@/video/state/logic/source";
import { getPlayerState } from "../cache";
import { updateMediaPlaying } from "../logic/mediaplaying";
import { VideoPlayerStateProvider } from "./providerTypes";
import { updateProgress } from "../logic/progress";
import { handleBuffered } from "./utils";

export function createVideoStateProvider(
  descriptor: string,
  playerEl: HTMLVideoElement
): VideoPlayerStateProvider {
  const player = playerEl;
  const state = getPlayerState(descriptor);

  return {
    play() {
      player.play();
    },
    pause() {
      player.pause();
    },
    exitFullscreen() {
      if (!fscreen.fullscreenElement) return;
      fscreen.exitFullscreen();
    },
    enterFullscreen() {
      if (!canFullscreen() || fscreen.fullscreenElement) return;
      if (canFullscreenAnyElement()) {
        if (state.wrapperElement)
          fscreen.requestFullscreen(state.wrapperElement);
        return;
      }
      if (canWebkitFullscreen()) {
        (player as any).webkitEnterFullscreen();
      }
    },
    setTime(t) {
      // clamp time between 0 and max duration
      let time = Math.min(t, player.duration);
      time = Math.max(0, time);

      if (Number.isNaN(time)) return;

      // update state
      player.currentTime = time;
      state.progress.time = time;
      updateProgress(descriptor, state);
    },
    setSeeking(active) {
      // if it was playing when starting to seek, play again
      if (!active) {
        if (!state.pausedWhenSeeking) this.play();
        return;
      }

      // when seeking we pause the video
      // this variables isnt reactive, just used so the state can be remembered next unseek
      state.pausedWhenSeeking = state.mediaPlaying.isPaused;
      this.pause();
    },
    setSource(source) {
      if (!source) {
        player.src = "";
        state.source = null;
        updateSource(descriptor, state);
        return;
      }

      if (source?.type === MWStreamType.HLS) {
        if (player.canPlayType("application/vnd.apple.mpegurl")) {
          player.src = source.source;
        } else {
          // HLS support
          if (!Hls.isSupported()) {
            state.error = {
              name: `Not supported`,
              description: "Your browser does not support HLS video",
            };
            // TODO dispatch error
            return;
          }

          const hls = new Hls({ enableWorker: false });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              state.error = {
                name: `error ${data.details}`,
                description: data.error?.message ?? "Something went wrong",
              };
              // TODO dispatch error
            }
            console.error("HLS error", data);
          });

          hls.attachMedia(player);
          hls.loadSource(source.source);
        }
      } else if (source.type === MWStreamType.MP4) {
        player.src = source.source;
      }

      // update state
      state.source = {
        quality: source.quality,
        type: source.type,
        url: source.source,
      };
      updateSource(descriptor, state);
    },
    providerStart() {
      // TODO stored volume
      const pause = () => {
        state.mediaPlaying.isPaused = true;
        state.mediaPlaying.isPlaying = false;
        updateMediaPlaying(descriptor, state);
      };
      const playing = () => {
        state.mediaPlaying.isPaused = false;
        state.mediaPlaying.isPlaying = true;
        state.mediaPlaying.isLoading = false;
        state.mediaPlaying.hasPlayedOnce = true;
        updateMediaPlaying(descriptor, state);
      };
      const waiting = () => {
        state.mediaPlaying.isLoading = true;
        updateMediaPlaying(descriptor, state);
      };
      const seeking = () => {
        state.mediaPlaying.isSeeking = true;
        updateMediaPlaying(descriptor, state);
      };
      const seeked = () => {
        state.mediaPlaying.isSeeking = false;
        updateMediaPlaying(descriptor, state);
      };
      const loadedmetadata = () => {
        state.progress.duration = player.duration;
        updateProgress(descriptor, state);
      };
      const timeupdate = () => {
        state.progress.duration = player.duration;
        state.progress.time = player.currentTime;
        updateProgress(descriptor, state);
      };
      const progress = () => {
        state.progress.buffered = handleBuffered(
          player.currentTime,
          player.buffered
        );
        updateProgress(descriptor, state);
      };
      const canplay = () => {
        state.mediaPlaying.isFirstLoading = false;
        updateMediaPlaying(descriptor, state);
      };
      const fullscreenchange = () => {
        state.interface.isFullscreen = !!document.fullscreenElement;
        updateInterface(descriptor, state);
      };

      player.addEventListener("pause", pause);
      player.addEventListener("playing", playing);
      player.addEventListener("seeking", seeking);
      player.addEventListener("seeked", seeked);
      player.addEventListener("progress", progress);
      player.addEventListener("waiting", waiting);
      player.addEventListener("timeupdate", timeupdate);
      player.addEventListener("loadedmetadata", loadedmetadata);
      player.addEventListener("canplay", canplay);
      fscreen.addEventListener("fullscreenchange", fullscreenchange);
      return {
        destroy: () => {
          player.removeEventListener("pause", pause);
          player.removeEventListener("playing", playing);
          player.removeEventListener("seeking", seeking);
          player.removeEventListener("seeked", seeked);
          player.removeEventListener("timeupdate", timeupdate);
          player.removeEventListener("loadedmetadata", loadedmetadata);
          player.removeEventListener("progress", progress);
          player.removeEventListener("waiting", waiting);
          player.removeEventListener("canplay", canplay);
          fscreen.removeEventListener("fullscreenchange", fullscreenchange);
        },
      };
    },
  };
}
