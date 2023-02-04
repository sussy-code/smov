import { updateInterface } from "@/video/state/logic/interface";
import { getPlayerState } from "../cache";
import { VideoPlayerStateController } from "../providers/providerTypes";

type ControlMethods = {
  openPopout(id: string): void;
  closePopout(): void;
  setLeftControlsHover(hovering: boolean): void;
  setFocused(focused: boolean): void;
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
      state.leftControlHovering = hovering;
      updateInterface(descriptor, state);
    },
    openPopout(id: string) {
      state.popout = id;
      updateInterface(descriptor, state);
    },
    closePopout() {
      state.popout = null;
      updateInterface(descriptor, state);
    },
    setFocused(focused) {
      state.isFocused = focused;
      updateInterface(descriptor, state);
    },
  };
}
