import { DisplayInterface } from "@/components/player/display/displayInterface";
import { MakeSlice } from "@/stores/player/slices/types";

export interface DisplaySlice {
  display: DisplayInterface | null;
  setDisplay(display: DisplayInterface | null): void;
}

export const createDisplaySlice: MakeSlice<DisplaySlice> = (set, get) => ({
  display: null,
  setDisplay(newDisplay: DisplayInterface | null) {
    const display = get().display;
    if (display) display.destroy();

    if (!newDisplay) {
      set((s) => {
        s.display = null;
      });
      return;
    }

    // make display events update the state
    newDisplay.on("pause", () =>
      set((s) => {
        s.mediaPlaying.isPaused = true;
        s.mediaPlaying.isPlaying = false;
      })
    );
    newDisplay.on("play", () =>
      set((s) => {
        s.mediaPlaying.hasPlayedOnce = true;
        s.mediaPlaying.isPaused = false;
        s.mediaPlaying.isPlaying = true;
      })
    );
    newDisplay.on("fullscreen", (isFullscreen) =>
      set((s) => {
        s.interface.isFullscreen = isFullscreen;
      })
    );
    newDisplay.on("time", (time) =>
      set((s) => {
        s.progress.time = time;
      })
    );
    newDisplay.on("volumechange", (vol) =>
      set((s) => {
        s.mediaPlaying.volume = vol;
      })
    );
    newDisplay.on("duration", (duration) =>
      set((s) => {
        s.progress.duration = duration;
      })
    );
    newDisplay.on("buffered", (buffered) =>
      set((s) => {
        s.progress.buffered = buffered;
      })
    );
    newDisplay.on("loading", (isLoading) =>
      set((s) => {
        s.mediaPlaying.isLoading = isLoading;
      })
    );

    set((s) => {
      s.display = newDisplay;
    });
  },
});
