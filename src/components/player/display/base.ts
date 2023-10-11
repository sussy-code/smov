import fscreen from "fscreen";

import {
  DisplayInterface,
  DisplayInterfaceEvents,
} from "@/components/player/display/displayInterface";
import { Source } from "@/components/player/hooks/usePlayer";
import { handleBuffered } from "@/components/player/utils/handleBuffered";
import {
  canChangeVolume,
  canFullscreen,
  canFullscreenAnyElement,
  canWebkitFullscreen,
} from "@/utils/detectFeatures";
import { makeEmitter } from "@/utils/events";

export function makeVideoElementDisplayInterface(): DisplayInterface {
  const { emit, on, off } = makeEmitter<DisplayInterfaceEvents>();
  let source: Source | null = null;
  let videoElement: HTMLVideoElement | null = null;
  let containerElement: HTMLElement | null = null;
  let isFullscreen = false;
  let isPausedBeforeSeeking = false;
  let isSeeking = false;

  function setSource() {
    if (!videoElement || !source) return;
    videoElement.src = source.url;

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
      if (videoElement) {
        videoElement.src = "";
        videoElement.remove();
      }
      fscreen.removeEventListener("fullscreenchange", fullscreenChange);
    },
    load(newSource) {
      source = newSource;
      emit("loading", true);
      setSource();
    },

    processVideoElement(video) {
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
        if (videoElement) (videoElement as any).webkitEnterFullscreen();
      }
    },
  };
}
