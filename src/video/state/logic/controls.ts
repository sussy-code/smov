import { getPlayerState } from "../cache";
import { VideoPlayerStateController } from "../providers/providerTypes";

export function useControls(descriptor: string): VideoPlayerStateController {
  const state = getPlayerState(descriptor);

  return {
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
  };
}
