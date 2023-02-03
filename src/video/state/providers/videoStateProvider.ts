import Hls from "hls.js";
import { MWStreamType } from "@/backend/helpers/streams";
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
    setTime(t) {
      // clamp time between 0 and max duration
      let time = Math.min(t, player.duration);
      time = Math.max(0, time);

      if (Number.isNaN(time)) return;

      // update state
      player.currentTime = time;
      state.time = time;
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
      state.pausedWhenSeeking = state.isPaused;
      this.pause();
    },
    setSource(source) {
      if (!source) {
        player.src = "";
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
    },
    providerStart() {
      // TODO stored volume
      const pause = () => {
        state.isPaused = true;
        state.isPlaying = false;
        updateMediaPlaying(descriptor, state);
      };
      const playing = () => {
        state.isPaused = false;
        state.isPlaying = true;
        state.isLoading = false;
        state.hasPlayedOnce = true;
        updateMediaPlaying(descriptor, state);
      };
      const waiting = () => {
        state.isLoading = true;
        updateMediaPlaying(descriptor, state);
      };
      const seeking = () => {
        state.isSeeking = true;
        updateMediaPlaying(descriptor, state);
      };
      const seeked = () => {
        state.isSeeking = false;
        updateMediaPlaying(descriptor, state);
      };
      const loadedmetadata = () => {
        state.duration = player.duration;
        updateProgress(descriptor, state);
      };
      const timeupdate = () => {
        state.duration = player.duration;
        state.time = player.currentTime;
        updateProgress(descriptor, state);
      };
      const progress = () => {
        state.buffered = handleBuffered(player.currentTime, player.buffered);
        updateProgress(descriptor, state);
      };
      const canplay = () => {
        state.isFirstLoading = false;
        updateMediaPlaying(descriptor, state);
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
        },
      };
    },
  };
}
