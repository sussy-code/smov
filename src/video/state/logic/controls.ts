import { MWMediaMeta } from "@/backend/metadata/types";
import { updateInterface } from "@/video/state/logic/interface";
import { updateMeta } from "@/video/state/logic/meta";
import { getPlayerState } from "../cache";
import { VideoPlayerStateController } from "../providers/providerTypes";

type ControlMethods = {
  openPopout(id: string): void;
  closePopout(): void;
  setLeftControlsHover(hovering: boolean): void;
  setFocused(focused: boolean): void;
  setMeta(meta?: MWMediaMeta): void;
};

export function useControls(
  descriptor: string
): VideoPlayerStateController & ControlMethods {
  const state = getPlayerState(descriptor);

  return {
    // state provider controls
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

    // other controls
    setLeftControlsHover(hovering) {
      state.interface.leftControlHovering = hovering;
      updateInterface(descriptor, state);
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
        state.meta = {
          meta,
        };
      }
      updateMeta(descriptor, state);
    },
  };
}
