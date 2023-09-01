import { Controller } from "@/stores/player/controllers/types";

export function useBaseController(): Controller {
  let el: HTMLVideoElement | undefined;

  return {
    registerVideoElement(video) {
      el = video;
    },
    pause() {
      el?.pause();
    },
    play() {
      el?.play();
    },
    setVolume(target) {
      if (!el) return;
      el.volume = target;
    },
  };
}
