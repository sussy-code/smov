export interface Controller {
  pause(): void;
  play(): void;
  setVolume(target: number): void;
  registerVideoElement(videoElement: HTMLVideoElement): void;
}
