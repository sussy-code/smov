import { Source } from "@/components/player/hooks/usePlayer";
import { Listener } from "@/utils/events";

export type DisplayInterfaceEvents = {
  play: void;
  pause: void;
  fullscreen: boolean;
};

export interface DisplayInterface extends Listener<DisplayInterfaceEvents> {
  play(): void;
  pause(): void;
  load(source: Source): void;
  processVideoElement(video: HTMLVideoElement): void;
  processContainerElement(container: HTMLElement): void;
  toggleFullscreen(): void;
  destroy(): void;
}
