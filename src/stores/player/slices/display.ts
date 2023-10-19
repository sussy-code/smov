import { DisplayInterface } from "@/components/player/display/displayInterface";
import { playerStatus } from "@/stores/player/slices/source";
import { MakeSlice } from "@/stores/player/slices/types";

export interface DisplaySlice {
  display: DisplayInterface | null;
  setDisplay(display: DisplayInterface | null): void;
  reset(): void;
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
    newDisplay.on("qualities", (qualities) => {
      set((s) => {
        s.qualities = qualities;
      });
    });
    newDisplay.on("changedquality", (quality) => {
      set((s) => {
        s.currentQuality = quality;
      });
    });
    newDisplay.on("needstrack", (needsTrack) => {
      set((s) => {
        s.caption.asTrack = needsTrack;
      });
    });
    newDisplay.on("canairplay", (canAirplay) => {
      set((s) => {
        s.interface.canAirplay = canAirplay;
      });
    });

    set((s) => {
      s.display = newDisplay;
    });
  },
  reset() {
    get().display?.load(null, 0);
    set((s) => {
      s.status = playerStatus.IDLE;
      s.meta = null;
    });
  },
});
