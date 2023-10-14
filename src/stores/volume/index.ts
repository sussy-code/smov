import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface VolumeStore {
  volume: number;
  setVolume(v: number): void;
}

export type VolumeState = StateCreator<
  VolumeStore,
  [["zustand/persist", never]],
  []
>;

// TODO add migration from previous stored volume
export const useVolumeStore: VolumeState = create(
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
