import fscreen from "fscreen";

import { revokeCaptionBlob } from "@/backend/helpers/captions";
import {
  canChangeVolume,
  canFullscreen,
  canFullscreenAnyElement,
  canWebkitFullscreen,
} from "@/utils/detectFeatures";
import {
  getStoredVolume,
  setStoredVolume,
} from "@/video/components/hooks/volumeStore";
import { updateInterface } from "@/video/state/logic/interface";
import { updateSource } from "@/video/state/logic/source";
import { resetStateForSource } from "@/video/state/providers/helpers";

import { VideoPlayerStateProvider } from "./providerTypes";
import { getPlayerState } from "../cache";
import { updateMediaPlaying } from "../logic/mediaplaying";
import { updateProgress } from "../logic/progress";

// TODO HLS for casting?
export function createCastingStateProvider(
  descriptor: string
): VideoPlayerStateProvider {
  const state = getPlayerState(descriptor);
  const ins = state.casting.instance;
  const player = state.casting.player;
  const controller = state.casting.controller;

  return {
    getId() {
      return "casting";
    },
    play() {
      if (state.mediaPlaying.isPaused) controller?.playOrPause();
    },
    pause() {
      if (state.mediaPlaying.isPlaying) controller?.playOrPause();
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
      // no airplay while casting
    },
    setTime(t) {
      // clamp time between 0 and max duration
      let time = Math.min(t, player?.duration ?? 0);
      time = Math.max(0, time);

      if (Number.isNaN(time)) return;

      // update state
      if (player) player.currentTime = time;
      state.progress.time = time;
      controller?.seek();
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
    togglePictureInPicture() {
      // no picture in picture while casting
    },
    setPlaybackSpeed(num) {
      const mediaInfo = new chrome.cast.media.MediaInfo(
        state.meta?.meta.meta.id ?? "video",
        "video/mp4"
      );
      (mediaInfo as any).contentUrl = state.source?.url;
      mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
      mediaInfo.metadata = new chrome.cast.media.MovieMediaMetadata();
      mediaInfo.metadata.title = state.meta?.meta.meta.title ?? "";
      mediaInfo.customData = {
        playbackRate: num,
      };
      const request = new chrome.cast.media.LoadRequest(mediaInfo);
      request.autoplay = true;
      const session = ins?.getCurrentSession();
      session?.loadMedia(request);
    },
    async setVolume(v) {
      // clamp time between 0 and 1
      let volume = Math.min(v, 1);
      volume = Math.max(0, volume);

      // update state
      if ((await canChangeVolume()) && player) player.volumeLevel = volume;
      state.mediaPlaying.volume = volume;
      controller?.setVolumeLevel();
      updateMediaPlaying(descriptor, state);

      // update localstorage
      setStoredVolume(volume);
    },
    setSource(source) {
      if (!source) {
        resetStateForSource(descriptor, state);
        controller?.stop();
        state.source = null;
        updateSource(descriptor, state);
        return;
      }

      const movieMeta = new chrome.cast.media.MovieMediaMetadata();
      movieMeta.title = state.meta?.meta.meta.title ?? "";

      const mediaInfo = new chrome.cast.media.MediaInfo(
        state.meta?.meta.meta.id ?? "video",
        "video/mp4"
      );
      (mediaInfo as any).contentUrl = source?.source;
      mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
      mediaInfo.metadata = movieMeta;

      const request = new chrome.cast.media.LoadRequest(mediaInfo);
      request.autoplay = true;

      const session = ins?.getCurrentSession();
      session?.loadMedia(request);

      // update state
      state.source = {
        quality: source.quality,
        type: source.type,
        url: source.source,
        caption: null,
        embedId: source.embedId,
        providerId: source.providerId,
      };
      resetStateForSource(descriptor, state);
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
    providerStart() {
      this.setVolume(getStoredVolume());

      const listenToEvents = async (
        e: cast.framework.RemotePlayerChangedEvent
      ) => {
        switch (e.field) {
          case "volumeLevel":
            if (await canChangeVolume()) {
              state.mediaPlaying.volume = e.value;
              updateMediaPlaying(descriptor, state);
            }
            break;
          case "currentTime":
            state.progress.time = e.value;
            updateProgress(descriptor, state);
            break;
          case "mediaInfo":
            if (e.value) {
              state.progress.duration = e.value.duration;
              updateProgress(descriptor, state);
            }
            break;
          case "playerState":
            state.mediaPlaying.isLoading = e.value === "BUFFERING";
            state.mediaPlaying.isPaused = e.value !== "PLAYING";
            state.mediaPlaying.isPlaying = e.value === "PLAYING";
            if (e.value === "PLAYING") {
              state.mediaPlaying.hasPlayedOnce = true;
              state.mediaPlaying.isFirstLoading = false;
            }
            updateMediaPlaying(descriptor, state);
            break;
          case "isMuted":
            state.mediaPlaying.volume = e.value ? 1 : 0;
            updateMediaPlaying(descriptor, state);
            break;
          case "displayStatus":
          case "canSeek":
          case "title":
          case "isPaused":
            break;
          default:
            console.log(e.type, e.field, e.value);
            break;
        }
      };
      const fullscreenchange = () => {
        state.interface.isFullscreen = !!document.fullscreenElement;
        updateInterface(descriptor, state);
      };
      const isFocused = (evt: any) => {
        state.interface.isFocused = evt.type !== "mouseleave";
        updateInterface(descriptor, state);
      };

      controller?.addEventListener(
        cast.framework.RemotePlayerEventType.ANY_CHANGE,
        listenToEvents
      );
      state.wrapperElement?.addEventListener("click", isFocused);
      state.wrapperElement?.addEventListener("mouseenter", isFocused);
      state.wrapperElement?.addEventListener("mouseleave", isFocused);
      fscreen.addEventListener("fullscreenchange", fullscreenchange);

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
          controller?.removeEventListener(
            cast.framework.RemotePlayerEventType.ANY_CHANGE,
            listenToEvents
          );
          state.wrapperElement?.removeEventListener("click", isFocused);
          state.wrapperElement?.removeEventListener("mouseenter", isFocused);
          state.wrapperElement?.removeEventListener("mouseleave", isFocused);
          fscreen.removeEventListener("fullscreenchange", fullscreenchange);
          ins?.endCurrentSession(true);
        },
      };
    },
  };
}
