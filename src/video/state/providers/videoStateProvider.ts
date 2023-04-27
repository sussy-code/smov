import fscreen from "fscreen";
import Hls from "hls.js";

import { revokeCaptionBlob } from "@/backend/helpers/captions";
import { MWStreamType } from "@/backend/helpers/streams";
import {
  canChangeVolume,
  canFullscreen,
  canFullscreenAnyElement,
  canPictureInPicture,
  canWebkitFullscreen,
  canWebkitPictureInPicture,
} from "@/utils/detectFeatures";
import {
  getStoredVolume,
  setStoredVolume,
} from "@/video/components/hooks/volumeStore";
import { updateError } from "@/video/state/logic/error";
import { updateInterface } from "@/video/state/logic/interface";
import { updateMisc } from "@/video/state/logic/misc";
import { updateSource } from "@/video/state/logic/source";
import { resetStateForSource } from "@/video/state/providers/helpers";

import { VideoPlayerStateProvider } from "./providerTypes";
import { handleBuffered } from "./utils";
import { getPlayerState } from "../cache";
import { updateMediaPlaying } from "../logic/mediaplaying";
import { updateProgress } from "../logic/progress";

function errorMessage(err: MediaError) {
  switch (err.code) {
    case MediaError.MEDIA_ERR_ABORTED:
      return {
        code: "ABORTED",
        description: "Video was aborted",
      };
    case MediaError.MEDIA_ERR_NETWORK:
      return {
        code: "NETWORK_ERROR",
        description: "A network error occured, the video failed to stream",
      };
    case MediaError.MEDIA_ERR_DECODE:
      return {
        code: "DECODE_ERROR",
        description: "Video stream could not be decoded",
      };
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return {
        code: "SRC_NOT_SUPPORTED",
        description: "The video type is not supported by your browser",
      };
    default:
      return {
        code: "UNKNOWN_ERROR",
        description: "Unknown media error occured",
      };
  }
}

export function createVideoStateProvider(
  descriptor: string,
  playerEl: HTMLVideoElement
): VideoPlayerStateProvider {
  const player = playerEl;
  const state = getPlayerState(descriptor);

  return {
    getId() {
      return "video";
    },
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
    startAirplay() {
      const videoPlayer = player as any;
      if (videoPlayer.webkitShowPlaybackTargetPicker)
        videoPlayer.webkitShowPlaybackTargetPicker();
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
      state.mediaPlaying.isSeeking = active;
      state.mediaPlaying.isDragSeeking = active;
      updateMediaPlaying(descriptor, state);

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
    async setVolume(v) {
      // clamp time between 0 and 1
      let volume = Math.min(v, 1);
      volume = Math.max(0, volume);

      // update state
      if (await canChangeVolume()) player.volume = volume;
      state.mediaPlaying.volume = volume;
      updateMediaPlaying(descriptor, state);

      // update localstorage
      setStoredVolume(volume);
    },
    setSource(source) {
      if (!source) {
        resetStateForSource(descriptor, state);
        player.removeAttribute("src");
        player.load();
        state.source = null;
        updateSource(descriptor, state);
        return;
      }

      // reset before assign new one so the old HLS instance gets destroyed
      resetStateForSource(descriptor, state);

      if (source?.type === MWStreamType.HLS) {
        if (player.canPlayType("application/vnd.apple.mpegurl")) {
          // HLS supported natively by browser
          player.src = source.source;
        } else {
          // HLS through HLS.js
          if (!Hls.isSupported()) {
            state.error = {
              name: `Not supported`,
              description: "Your browser does not support HLS video",
            };
            updateError(descriptor, state);
            return;
          }

          const hls = new Hls({ enableWorker: false });
          state.hlsInstance = hls;

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              state.error = {
                name: `error ${data.details}`,
                description: data.error?.message ?? "Something went wrong",
              };
              updateError(descriptor, state);
            }
            console.error("HLS error", data);
          });

          hls.attachMedia(player);
          hls.loadSource(source.source);
        }
      } else if (source.type === MWStreamType.MP4) {
        // standard MP4 stream
        player.src = source.source;
      }

      // update state
      state.source = {
        quality: source.quality,
        type: source.type,
        url: source.source,
        caption: null,
        embedId: source.embedId,
        providerId: source.providerId,
      };
      updateSource(descriptor, state);
    },
    setCaption(id, url) {
      if (state.source) {
        revokeCaptionBlob(state.source.caption?.url);
        state.source.caption = {
          id,
          url,
        };
        updateSource(descriptor, state);
      }
    },
    clearCaption() {
      if (state.source) {
        revokeCaptionBlob(state.source.caption?.url);
        state.source.caption = null;
        updateSource(descriptor, state);
      }
    },
    togglePictureInPicture() {
      if (canWebkitPictureInPicture()) {
        const webkitPlayer = player as any;
        webkitPlayer.webkitSetPresentationMode(
          webkitPlayer.webkitPresentationMode === "picture-in-picture"
            ? "inline"
            : "picture-in-picture"
        );
      }
      if (canPictureInPicture()) {
        if (player !== document.pictureInPictureElement) {
          player.requestPictureInPicture();
        } else {
          document.exitPictureInPicture();
        }
      }
    },
    setPlaybackSpeed(num) {
      player.playbackRate = num;
      state.mediaPlaying.playbackSpeed = num;
      updateMediaPlaying(descriptor, state);
    },
    providerStart() {
      this.setVolume(getStoredVolume());

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
        state.mediaPlaying.isLoading = false;
        updateMediaPlaying(descriptor, state);
      };
      const ratechange = () => {
        state.mediaPlaying.playbackSpeed = player.playbackRate;
        updateMediaPlaying(descriptor, state);
      };
      const fullscreenchange = () => {
        state.interface.isFullscreen =
          !!document.fullscreenElement || // other browsers
          !!(document as any).webkitFullscreenElement; // safari
        updateInterface(descriptor, state);
      };
      const volumechange = async () => {
        if (await canChangeVolume()) {
          state.mediaPlaying.volume = player.volume;
          updateMediaPlaying(descriptor, state);
        }
      };
      const isFocused = (evt: any) => {
        state.interface.isFocused = evt.type !== "mouseleave";
        updateInterface(descriptor, state);
      };
      const canAirplay = (e: any) => {
        if (e.availability === "available") {
          state.canAirplay = true;
          updateMisc(descriptor, state);
        }
      };
      const error = () => {
        if (player.error) {
          const err = errorMessage(player.error);
          console.error("Native video player threw error", player.error);
          state.error = {
            description: err.description,
            name: `Error ${err.code}`,
          };
          this.pause(); // stop video from playing
        } else {
          state.error = null;
        }
        updateError(descriptor, state);
      };

      state.wrapperElement?.addEventListener("click", isFocused);
      state.wrapperElement?.addEventListener("mouseenter", isFocused);
      state.wrapperElement?.addEventListener("mouseleave", isFocused);
      player.addEventListener("volumechange", volumechange);
      player.addEventListener("pause", pause);
      player.addEventListener("playing", playing);
      player.addEventListener("seeking", seeking);
      player.addEventListener("seeked", seeked);
      player.addEventListener("progress", progress);
      player.addEventListener("waiting", waiting);
      player.addEventListener("timeupdate", timeupdate);
      player.addEventListener("loadedmetadata", loadedmetadata);
      player.addEventListener("canplay", canplay);
      player.addEventListener("ratechange", ratechange);
      fscreen.addEventListener("fullscreenchange", fullscreenchange);
      player.addEventListener("error", error);
      player.addEventListener(
        "webkitplaybacktargetavailabilitychanged",
        canAirplay
      );

      if (state.source)
        this.setSource({
          quality: state.source.quality,
          source: state.source.url,
          type: state.source.type,
          embedId: state.source.embedId,
          providerId: state.source.providerId,
        });

      return {
        destroy: () => {
          player.removeEventListener("pause", pause);
          player.removeEventListener("playing", playing);
          player.removeEventListener("seeking", seeking);
          player.removeEventListener("volumechange", volumechange);
          player.removeEventListener("seeked", seeked);
          player.removeEventListener("timeupdate", timeupdate);
          player.removeEventListener("loadedmetadata", loadedmetadata);
          player.removeEventListener("progress", progress);
          player.removeEventListener("waiting", waiting);
          player.removeEventListener("error", error);
          player.removeEventListener("canplay", canplay);
          fscreen.removeEventListener("fullscreenchange", fullscreenchange);
          state.wrapperElement?.removeEventListener("click", isFocused);
          state.wrapperElement?.removeEventListener("mouseenter", isFocused);
          state.wrapperElement?.removeEventListener("mouseleave", isFocused);
          player.removeEventListener(
            "webkitplaybacktargetavailabilitychanged",
            canAirplay
          );
        },
      };
    },
  };
}
