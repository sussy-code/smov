import { getPlayerState } from "../cache";
import { updateMediaPlaying } from "../logic/mediaplaying";
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
      const pause = () => {
        state.isPaused = true;
        state.isPlaying = false;
        updateMediaPlaying(descriptor, state);
      };
      const playing = () => {
        state.isPaused = false;
        state.isPlaying = true;
        state.isLoading = false;
        state.hasPlayedOnce = true;
        updateMediaPlaying(descriptor, state);
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
