export interface PlayerControls {
  play(): void;
  pause(): void;
  exitFullscreen(): void;
  enterFullscreen(): void;
}

export const initialControls: PlayerControls = {
  play: () => null,
  pause: () => null,
  enterFullscreen: () => null,
  exitFullscreen: () => null,
};

export function populateControls(
  player: HTMLVideoElement,
  wrapper: HTMLDivElement
): PlayerControls {
  return {
    play() {
      player.play();
    },
    pause() {
      player.pause();
    },
    enterFullscreen() {
      if (!document.fullscreenEnabled || document.fullscreenElement) return;
      wrapper.requestFullscreen();
    },
    exitFullscreen() {
      if (!document.fullscreenElement) return;
      document.exitFullscreen();
    },
  };
}
