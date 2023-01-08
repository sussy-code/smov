export interface PlayerControls {
  play(): void;
  pause(): void;
}

export const initialControls: PlayerControls = {
  play: () => null,
  pause: () => null,
};

export function populateControls(player: HTMLVideoElement): PlayerControls {
  return {
    play() {
      player.play();
    },
    pause() {
      player.pause();
    },
  };
}
