import fscreen from "fscreen";
import Hls from "hls.js";

import {
  DisplayInterface,
  DisplayInterfaceEvents,
} from "@/components/player/display/displayInterface";
import { handleBuffered } from "@/components/player/utils/handleBuffered";
import { LoadableSource } from "@/stores/player/utils/qualities";
import {
  canChangeVolume,
  canFullscreen,
  canFullscreenAnyElement,
  canWebkitFullscreen,
} from "@/utils/detectFeatures";
import { makeEmitter } from "@/utils/events";

export function makeVideoElementDisplayInterface(): DisplayInterface {
  const { emit, on, off } = makeEmitter<DisplayInterfaceEvents>();
  let source: LoadableSource | null = null;
  let hls: Hls | null = null;
  let videoElement: HTMLVideoElement | null = null;
  let containerElement: HTMLElement | null = null;
  let isFullscreen = false;
  let isPausedBeforeSeeking = false;
  let isSeeking = false;
  let startAt = 0;

  function setupSource(vid: HTMLVideoElement, src: LoadableSource) {
    if (src.type === "hls") {
      if (!Hls.isSupported()) throw new Error("HLS not supported");

      if (!hls) {
        hls = new Hls({ enableWorker: false });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error", data);
          if (data.fatal) {
            throw new Error(
              `HLS ERROR:${data.error?.message ?? "Something went wrong"}`
            );
          }
        });
      }

      hls.attachMedia(vid);
      hls.loadSource(src.url);
      vid.currentTime = startAt;
      return;
    }

    vid.src = src.url;
    vid.currentTime = startAt;
  }

  function setSource() {
    if (!videoElement || !source) return;
    setupSource(videoElement, source);

    videoElement.addEventListener("play", () => {
      emit("play", undefined);
      emit("loading", false);
    });
    videoElement.addEventListener("playing", () => emit("play", undefined));
    videoElement.addEventListener("pause", () => emit("pause", undefined));
    videoElement.addEventListener("canplay", () => emit("loading", false));
    videoElement.addEventListener("waiting", () => emit("loading", true));
    videoElement.addEventListener("volumechange", () =>
      emit("volumechange", videoElement?.muted ? 0 : videoElement?.volume ?? 0)
    );
    videoElement.addEventListener("timeupdate", () =>
      emit("time", videoElement?.currentTime ?? 0)
    );
    videoElement.addEventListener("loadedmetadata", () => {
      emit("duration", videoElement?.duration ?? 0);
    });
    videoElement.addEventListener("progress", () => {
      if (videoElement)
        emit(
          "buffered",
          handleBuffered(videoElement.currentTime, videoElement.buffered)
        );
    });
  }

  function unloadSource() {
    if (videoElement) videoElement.removeAttribute("src");
    if (hls) {
      hls.destroy();
      hls = null;
    }
  }

  function destroyVideoElement() {
    unloadSource();
    if (videoElement) {
      videoElement = null;
    }
  }

  function fullscreenChange() {
    isFullscreen =
      !!document.fullscreenElement || // other browsers
      !!(document as any).webkitFullscreenElement; // safari
  }
  fscreen.addEventListener("fullscreenchange", fullscreenChange);

  return {
    on,
    off,
    destroy: () => {
      destroyVideoElement();
      fscreen.removeEventListener("fullscreenchange", fullscreenChange);
    },
    load(newSource, startAtInput) {
      if (!newSource) unloadSource();
      source = newSource;
      emit("loading", true);
      startAt = startAtInput;
      setSource();
    },

    processVideoElement(video) {
      destroyVideoElement();
      videoElement = video;
      setSource();
    },
    processContainerElement(container) {
      containerElement = container;
    },

    pause() {
      videoElement?.pause();
    },
    play() {
      videoElement?.play();
    },
    setSeeking(active) {
      if (active === isSeeking) return;
      isSeeking = active;

      // if it was playing when starting to seek, play again
      if (!active) {
        if (!isPausedBeforeSeeking) this.play();
        return;
      }

      isPausedBeforeSeeking = videoElement?.paused ?? true;
      this.pause();
    },
    setTime(t) {
      if (!videoElement) return;
      // clamp time between 0 and max duration
      let time = Math.min(t, videoElement.duration);
      time = Math.max(0, time);

      if (Number.isNaN(time)) return;
      emit("time", time);
      videoElement.currentTime = time;
    },
    async setVolume(v) {
      if (!videoElement) return;

      // clamp time between 0 and 1
      let volume = Math.min(v, 1);
      volume = Math.max(0, volume);
      videoElement.muted = volume === 0; // Muted attribute is always supported

      // update state
      const isChangeable = await canChangeVolume();
      if (isChangeable) {
        videoElement.volume = volume;
      } else {
        // For browsers where it can't be changed
        emit("volumechange", volume === 0 ? 0 : 1);
      }
    },
    toggleFullscreen() {
      if (isFullscreen) {
        isFullscreen = false;
        emit("fullscreen", isFullscreen);
        emit("needstrack", false);
        if (!fscreen.fullscreenElement) return;
        fscreen.exitFullscreen();
        return;
      }

      // enter fullscreen
      isFullscreen = true;
      emit("fullscreen", isFullscreen);
      if (!canFullscreen() || fscreen.fullscreenElement) return;
      if (canFullscreenAnyElement()) {
        if (containerElement) fscreen.requestFullscreen(containerElement);
        return;
      }
      if (canWebkitFullscreen()) {
        if (videoElement) {
          emit("needstrack", true);
          (videoElement as any).webkitEnterFullscreen();
        }
      }
    },
  };
}
