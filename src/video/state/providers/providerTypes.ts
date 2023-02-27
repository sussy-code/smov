import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";

type VideoPlayerSource = {
  source: string;
  type: MWStreamType;
  quality: MWStreamQuality;
} | null;

export type VideoPlayerStateController = {
  pause: () => void;
  play: () => void;
  setSource: (source: VideoPlayerSource) => void;
  setTime(time: number): void;
  setSeeking(active: boolean): void;
  exitFullscreen(): void;
  enterFullscreen(): void;
  setVolume(volume: number): void;
  startAirplay(): void;
  setCaption(id: string, url: string): void;
  clearCaption(): void;
  getId(): string;
  togglePictureInPicture(): void;
};

export type VideoPlayerStateProvider = VideoPlayerStateController & {
  providerStart: () => {
    destroy: () => void;
  };
};
