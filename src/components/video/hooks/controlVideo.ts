export interface PlayerControls {
  play(): void;
  pause(): void;
  exitFullscreen(): void;
  enterFullscreen(): void;
  setTime(time: number): void;
  setVolume(volume: number): void;
}

export const initialControls: PlayerControls = {
  play: () => null,
  pause: () => null,
  enterFullscreen: () => null,
  exitFullscreen: () => null,
  setTime: () => null,
  setVolume: () => null,
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
    setTime(t) {
      // clamp time between 0 and max duration
      let time = Math.min(t, player.duration);
      time = Math.max(0, time);
      // eslint-disable-next-line no-param-reassign
      player.currentTime = time;
    },
    setVolume(v) {
      // clamp time between 0 and 1
      let volume = Math.min(v, 1);
      volume = Math.max(0, volume);
      // eslint-disable-next-line no-param-reassign
      player.volume = volume;
    },
  };
}
