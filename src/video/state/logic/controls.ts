import { updateInterface } from "@/video/state/logic/interface";
import { updateMeta } from "@/video/state/logic/meta";
import { updateProgress } from "@/video/state/logic/progress";
import { VideoPlayerMeta, VideoPlayerTimeFormat } from "@/video/state/types";

import { getPlayerState } from "../cache";
import { VideoPlayerStateController } from "../providers/providerTypes";

export type ControlMethods = {
  openPopout(id: string): void;
  closePopout(): void;
  setLeftControlsHover(hovering: boolean): void;
  setFocused(focused: boolean): void;
  setMeta(data?: VideoPlayerMeta): void;
  setCurrentEpisode(sId: string, eId: string): void;
  setDraggingTime(num: number): void;
  togglePictureInPicture(): void;
  setPlaybackSpeed(num: number): void;
  setTimeFormat(num: VideoPlayerTimeFormat): void;
};

export function useControls(
  descriptor: string
): VideoPlayerStateController & ControlMethods {
  const state = getPlayerState(descriptor);

  return {
    // state provider controls
    getId() {
      return state.stateProvider?.getId() ?? "";
    },
    pause() {
      state.stateProvider?.pause();
    },
    play() {
      state.stateProvider?.play();
    },
    setSource(source) {
      state.stateProvider?.setSource(source);
    },
    setSeeking(active) {
      state.stateProvider?.setSeeking(active);
    },
    setTime(time) {
      state.stateProvider?.setTime(time);
    },
    exitFullscreen() {
      state.stateProvider?.exitFullscreen();
    },
    enterFullscreen() {
      state.stateProvider?.enterFullscreen();
    },
    setVolume(volume, isKeyboardEvent = false) {
      if (isKeyboardEvent) {
        if (state.interface.volumeChangedWithKeybindDebounce)
          clearTimeout(state.interface.volumeChangedWithKeybindDebounce);

        state.interface.volumeChangedWithKeybind = true;
        updateInterface(descriptor, state);

        state.interface.volumeChangedWithKeybindDebounce = setTimeout(() => {
          state.interface.volumeChangedWithKeybind = false;
          updateInterface(descriptor, state);
        }, 3e3);
      }
      state.stateProvider?.setVolume(volume, isKeyboardEvent);
    },
    startAirplay() {
      state.stateProvider?.startAirplay();
    },
    setCaption(id, url) {
      state.stateProvider?.setCaption(id, url);
    },
    clearCaption() {
      state.stateProvider?.clearCaption();
    },

    // other controls
    setLeftControlsHover(hovering) {
      state.interface.leftControlHovering = hovering;
      updateInterface(descriptor, state);
    },
    setDraggingTime(num) {
      state.progress.draggingTime = Math.max(
        0,
        Math.min(state.progress.duration, num)
      );
      updateProgress(descriptor, state);
    },
    openPopout(id: string) {
      state.interface.popout = id;
      updateInterface(descriptor, state);
    },
    closePopout() {
      state.interface.popout = null;
      updateInterface(descriptor, state);
    },
    setFocused(focused) {
      state.interface.isFocused = focused;
      updateInterface(descriptor, state);
    },
    setMeta(meta) {
      if (!meta) {
        state.meta = null;
      } else {
        state.meta = meta;
      }
      updateMeta(descriptor, state);
    },
    setCurrentEpisode(sId, eId) {
      if (state.meta) {
        state.meta.episode = {
          seasonId: sId,
          episodeId: eId,
        };
        updateMeta(descriptor, state);
      }
    },
    togglePictureInPicture() {
      state.stateProvider?.togglePictureInPicture();
      updateInterface(descriptor, state);
    },
    setPlaybackSpeed(num) {
      state.stateProvider?.setPlaybackSpeed(num);
      updateInterface(descriptor, state);
    },
    setTimeFormat(format) {
      state.interface.timeFormat = format;
      updateInterface(descriptor, state);
    },
  };
}
