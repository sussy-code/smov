import fscreen from "fscreen";

import {
  DisplayInterface,
  DisplayInterfaceEvents,
} from "@/components/player/display/displayInterface";
import { LoadableSource } from "@/stores/player/utils/qualities";
import {
  canChangeVolume,
  canFullscreen,
  canFullscreenAnyElement,
} from "@/utils/detectFeatures";
import { makeEmitter } from "@/utils/events";

export interface ChromeCastDisplayInterfaceOptions {
  controller: cast.framework.RemotePlayerController;
  player: cast.framework.RemotePlayer;
  instance: cast.framework.CastContext;
}

// TODO check all functionality
// TODO listen for events to update the state
export function makeChromecastDisplayInterface(
  ops: ChromeCastDisplayInterfaceOptions
): DisplayInterface {
  const { emit, on, off } = makeEmitter<DisplayInterfaceEvents>();
  const isPaused = false;
  let playbackRate = 1;
  let source: LoadableSource | null = null;
  let videoElement: HTMLVideoElement | null = null;
  let containerElement: HTMLElement | null = null;
  let isFullscreen = false;
  let isPausedBeforeSeeking = false;
  let isSeeking = false;
  let startAt = 0;
  // let automaticQuality = false;
  // let preferenceQuality: SourceQuality | null = null;

  function setupSource() {
    if (!source) {
      ops.controller?.stop();
      return;
    }

    if (source.type === "hls") {
      // TODO hls support
      return;
    }

    // TODO movie meta
    const movieMeta = new chrome.cast.media.MovieMediaMetadata();
    movieMeta.title = "";

    const mediaInfo = new chrome.cast.media.MediaInfo("video", "video/mp4");
    (mediaInfo as any).contentUrl = source.url;
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
    mediaInfo.metadata = movieMeta;
    mediaInfo.customData = {
      playbackRate,
    };

    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;

    ops.player.currentTime = startAt;
    const session = ops.instance.getCurrentSession();
    session?.loadMedia(request);
    ops.controller.seek();
  }

  function setSource() {
    if (!videoElement || !source) return;
    setupSource();
  }

  function destroyVideoElement() {
    if (videoElement) videoElement = null;
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
    load(loadOps) {
      // automaticQuality = loadOps.automaticQuality;
      // preferenceQuality = loadOps.preferredQuality;
      source = loadOps.source;
      emit("loading", true);
      startAt = loadOps.startAt;
      setSource();
    },
    changeQuality(_newAutomaticQuality, _newPreferredQuality) {
      // if (source?.type !== "hls") return;
      // automaticQuality = newAutomaticQuality;
      // preferenceQuality = newPreferredQuality;
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
      if (!isPaused) ops.controller.playOrPause();
    },
    play() {
      if (isPaused) ops.controller.playOrPause();
    },
    setSeeking(active) {
      if (active === isSeeking) return;
      isSeeking = active;

      // if it was playing when starting to seek, play again
      if (!active) {
        if (!isPausedBeforeSeeking) this.play();
        return;
      }

      isPausedBeforeSeeking = isPaused ?? true;
      this.pause();
    },
    setTime(t) {
      if (!videoElement) return;
      // clamp time between 0 and max duration
      let time = Math.min(t, ops.player.duration);
      time = Math.max(0, time);

      if (Number.isNaN(time)) return;
      emit("time", time);
      ops.player.currentTime = time;
      ops.controller.seek();
    },
    async setVolume(v) {
      // clamp time between 0 and 1
      let volume = Math.min(v, 1);
      volume = Math.max(0, volume);

      // update state
      const isChangeable = await canChangeVolume();
      if (isChangeable) {
        ops.player.volumeLevel = volume;
        ops.controller.setVolumeLevel();
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
      }
    },
    togglePictureInPicture() {
      // Can't PIP while Chromecasting
    },
    startAirplay() {
      // cant airplay while chromecasting
    },
    setPlaybackRate(rate) {
      playbackRate = rate;
      setSource();
    },
  };
}
