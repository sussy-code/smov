import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { SourceQuality } from "@/stores/player/utils/qualities";

export interface QualityStore {
  quality: {
    lastChosenQuality: SourceQuality | null;
    automaticQuality: boolean;
  };
  setLastChosenQuality(v: SourceQuality | null): void;
  setAutomaticQuality(v: boolean): void;
}

export const useQualityStore = create(
  persist(
    immer<QualityStore>((set) => ({
      quality: {
        automaticQuality: true,
        lastChosenQuality: null,
      },
      setLastChosenQuality(v) {
        set((s) => {
          s.quality.lastChosenQuality = v;
        });
      },
      setAutomaticQuality(v) {
        set((s) => {
          s.quality.automaticQuality = v;
        });
      },
    })),
    {
      name: "__MW::quality",
    },
  ),
);
