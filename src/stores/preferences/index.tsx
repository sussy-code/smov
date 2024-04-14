import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface PreferencesStore {
  enableThumbnails: boolean;
  setEnableThumbnails(v: boolean): void;
  enableAutoplay: boolean;
  setEnableAutoplay(v: boolean): void;
}

export const usePreferencesStore = create(
  persist(
    immer<PreferencesStore>((set) => ({
      enableThumbnails: false,
      setEnableThumbnails(v) {
        set((s) => {
          s.enableThumbnails = v;
        });
      },
      enableAutoplay: false,
      setEnableAutoplay(v) {
        set((s) => {
          s.enableAutoplay = v;
        });
      },
    })),
    {
      name: "__MW::preferences",
    },
  ),
);
