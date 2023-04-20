import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";

type VideoPlayerSource = {
  source: string;
  type: MWStreamType;
  quality: MWStreamQuality;
  providerId?: string;
  embedId?: string;
} | null;

export type VideoPlayerStateController = {
  pause: () => void;
  play: () => void;
  setSource: (source: VideoPlayerSource) => void;
  setTime(time: number): void;
  setSeeking(active: boolean): void;
  exitFullscreen(): void;
  enterFullscreen(): void;
  setVolume(volume: number, isKeyboardEvent?: boolean): void;
  startAirplay(): void;
  setCaption(id: string, url: string): void;
  clearCaption(): void;
  getId(): string;
  togglePictureInPicture(): void;
  setPlaybackSpeed(num: number): void;
};

export type VideoPlayerStateProvider = VideoPlayerStateController & {
  providerStart: () => {
    destroy: () => void;
  };
};
