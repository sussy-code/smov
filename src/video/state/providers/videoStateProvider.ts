import { getPlayerState } from "../cache";
import { VideoPlayerStateProvider } from "./providerTypes";

export function createVideoStateProvider(
  descriptor: string,
  player: HTMLVideoElement
): VideoPlayerStateProvider {
  const state = getPlayerState(descriptor);

  return {
    play() {
      player.play();
    },
    pause() {
      player.pause();
    },
    providerStart() {
      // TODO reactivity through events
      const pause = () => {
        state.isPaused = true;
        state.isPlaying = false;
      };
      const playing = () => {
        state.isPaused = false;
        state.isPlaying = true;
        state.isLoading = false;
        state.hasPlayedOnce = true;
      };

      player.addEventListener("pause", pause);
      player.addEventListener("playing", playing);
      return {
        destroy: () => {
          player.removeEventListener("pause", pause);
          player.removeEventListener("playing", playing);
        },
      };
    },
  };
}
