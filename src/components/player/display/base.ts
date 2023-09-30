import {
  DisplayInterface,
  DisplayInterfaceEvents,
} from "@/components/player/display/displayInterface";
import { Source } from "@/components/player/hooks/usePlayer";
import { makeEmitter } from "@/utils/events";

export function makeVideoElementDisplayInterface(): DisplayInterface {
  const { emit, on, off } = makeEmitter<DisplayInterfaceEvents>();
  let source: Source | null = null;
  let videoElement: HTMLVideoElement | null = null;

  function setSource() {
    if (!videoElement || !source) return;
    videoElement.src = source.url;
    videoElement.addEventListener("play", () => emit("play", undefined));
    videoElement.addEventListener("pause", () => emit("pause", undefined));
  }

  return {
    on,
    off,

    // no need to destroy anything
    destroy: () => {},

    load(newSource) {
      source = newSource;
      setSource();
    },

    processVideoElement(video) {
      videoElement = video;
      setSource();
    },

    pause() {
      videoElement?.pause();
    },

    play() {
      videoElement?.play();
    },
  };
}
