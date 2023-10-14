import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface VolumeStore {
  volume: number;
  setVolume(v: number): void;
}

// TODO add migration from previous stored volume
export const useVolumeStore = create(
  persist(
    immer<VolumeStore>((set) => ({
      volume: 1,
      setVolume(v: number) {
        set((s) => {
          s.volume = v;
        });
      },
    })),
    {
      name: "__MW::volume",
    }
  )
);
