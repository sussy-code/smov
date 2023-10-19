import { LoadableSource, SourceQuality } from "@/stores/player/utils/qualities";
import { Listener } from "@/utils/events";

export type DisplayInterfaceEvents = {
  play: void;
  pause: void;
  fullscreen: boolean;
  volumechange: number;
  time: number;
  duration: number;
  buffered: number;
  loading: boolean;
  qualities: SourceQuality[];
  changedquality: SourceQuality | null;
  needstrack: boolean;
  canairplay: boolean;
  playbackrate: number;
};

export interface qualityChangeOptions {
  source: LoadableSource | null;
  automaticQuality: boolean;
  preferredQuality: SourceQuality | null;
  startAt: number;
}

export interface DisplayInterface extends Listener<DisplayInterfaceEvents> {
  play(): void;
  pause(): void;
  load(ops: qualityChangeOptions): void;
  changeQuality(
    automaticQuality: boolean,
    preferredQuality: SourceQuality | null
  ): void;
  processVideoElement(video: HTMLVideoElement): void;
  processContainerElement(container: HTMLElement): void;
  toggleFullscreen(): void;
  setSeeking(active: boolean): void;
  setVolume(vol: number): void;
  setTime(t: number): void;
  destroy(): void;
  startAirplay(): void;
  setPlaybackRate(rate: number): void;
}
