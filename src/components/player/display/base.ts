import fscreen from "fscreen";
import Hls, { Level } from "hls.js";

import {
  DisplayInterface,
  DisplayInterfaceEvents,
} from "@/components/player/display/displayInterface";
import { handleBuffered } from "@/components/player/utils/handleBuffered";
import {
  LoadableSource,
  SourceQuality,
  getPreferredQuality,
} from "@/stores/player/utils/qualities";
import {
  canChangeVolume,
  canFullscreen,
  canFullscreenAnyElement,
  canWebkitFullscreen,
} from "@/utils/detectFeatures";
import { makeEmitter } from "@/utils/events";

const levelConversionMap: Record<number, SourceQuality> = {
  360: "360",
  1080: "1080",
  720: "720",
  480: "480",
};

function hlsLevelToQuality(level: Level): SourceQuality | null {
  return levelConversionMap[level.height] ?? null;
}

function qualityToHlsLevel(quality: SourceQuality): number | null {
  const found = Object.entries(levelConversionMap).find(
    (entry) => entry[1] === quality
  );
  return found ? +found[0] : null;
}
function hlsLevelsToQualities(levels: Level[]): SourceQuality[] {
  return levels
    .map((v) => hlsLevelToQuality(v))
    .filter((v): v is SourceQuality => !!v);
}

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
  let automaticQuality = false;
  let preferenceQuality: SourceQuality | null = null;

  function reportLevels() {
    if (!hls) return;
    const levels = hls.levels;
    const convertedLevels = levels
      .map((v) => hlsLevelToQuality(v))
      .filter((v): v is SourceQuality => !!v);
    emit("qualities", convertedLevels);
  }

  function setupQualityForHls() {
    if (!hls) return;
    if (!automaticQuality) {
      const qualities = hlsLevelsToQualities(hls.levels);
      const availableQuality = getPreferredQuality(qualities, {
        lastChosenQuality: preferenceQuality,
        automaticQuality,
      });
      if (availableQuality) {
        const levelIndex = hls.levels.findIndex(
          (v) => v.height === qualityToHlsLevel(availableQuality)
        );
        if (levelIndex !== -1) {
          console.log("setting level", levelIndex, availableQuality);
          hls.currentLevel = levelIndex;
          hls.loadLevel = levelIndex;
        }
      }
    } else {
      console.log("setting to automatic");
      hls.currentLevel = -1;
      hls.loadLevel = -1;
    }
    const quality = hlsLevelToQuality(hls.levels[hls.currentLevel]);
    console.log("updating quality menu", quality);
    emit("changedquality", quality);
  }

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
        hls.on(Hls.Events.MANIFEST_LOADED, () => {
          if (!hls) return;
          reportLevels();
          setupQualityForHls();
        });
        hls.on(Hls.Events.LEVEL_SWITCHED, () => {
          if (!hls) return;
          const quality = hlsLevelToQuality(hls.levels[hls.currentLevel]);
          console.log("EVENT updating quality menu", quality);
          emit("changedquality", quality);
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
    videoElement.addEventListener("webkitendfullscreen", () => {
      isFullscreen = false;
      emit("fullscreen", isFullscreen);
      if (!isFullscreen) emit("needstrack", false);
    });
    videoElement.addEventListener(
      "webkitplaybacktargetavailabilitychanged",
      (e: any) => {
        if (e.availability === "available") {
          emit("canairplay", true);
        }
      }
    );
    videoElement.addEventListener("ratechange", () => {
      if (videoElement) emit("playbackrate", videoElement.playbackRate);
    });
  }

  function unloadSource() {
    if (videoElement) videoElement.src = "";
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
    emit("fullscreen", isFullscreen);
    if (!isFullscreen) emit("needstrack", false);
  }
  fscreen.addEventListener("fullscreenchange", fullscreenChange);

  return {
    on,
    off,
    destroy: () => {
      destroyVideoElement();
      fscreen.removeEventListener("fullscreenchange", fullscreenChange);
    },
    load(ops) {
      if (!ops.source) unloadSource();
      automaticQuality = ops.automaticQuality;
      preferenceQuality = ops.preferredQuality;
      source = ops.source;
      emit("loading", true);
      startAt = ops.startAt;
      setSource();
    },
    changeQuality(newAutomaticQuality, newPreferredQuality) {
      if (source?.type !== "hls") return;
      automaticQuality = newAutomaticQuality;
      preferenceQuality = newPreferredQuality;
      setupQualityForHls();
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
    startAirplay() {
      const videoPlayer = videoElement as any;
      if (videoPlayer && videoPlayer.webkitShowPlaybackTargetPicker) {
        videoPlayer.webkitShowPlaybackTargetPicker();
      }
    },
    setPlaybackRate(rate) {
      if (videoElement) videoElement.playbackRate = rate;
    },
  };
}
