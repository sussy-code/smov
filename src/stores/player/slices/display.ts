import { DisplayInterface } from "@/components/player/display/displayInterface";
import { MakeSlice } from "@/stores/player/slices/types";

export interface DisplaySlice {
  display: DisplayInterface | null;
  setDisplay(display: DisplayInterface): void;
}

export const createDisplaySlice: MakeSlice<DisplaySlice> = (set, get) => ({
  display: null,
  setDisplay(newDisplay: DisplayInterface) {
    const display = get().display;
    if (display) display.destroy();

    // make display events update the state
    newDisplay.on("pause", () =>
      set((s) => {
        s.mediaPlaying.isPaused = true;
        s.mediaPlaying.isPlaying = false;
      })
    );
    newDisplay.on("play", () =>
      set((s) => {
        s.mediaPlaying.isPaused = false;
        s.mediaPlaying.isPlaying = true;
      })
    );
    newDisplay.on("fullscreen", (isFullscreen) =>
      set((s) => {
        s.interface.isFullscreen = isFullscreen;
      })
    );

    set((s) => {
      s.display = newDisplay;
    });
  },
});
