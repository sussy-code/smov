import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface VolumeStore {
  volume: number;
  setVolume(v: number): void;
}

export interface EmpheralVolumeStore {
  showVolume: boolean;
  setShowVolume(v: boolean): void;
}

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
    },
  ),
);

export const useEmpheralVolumeStore = create(
  immer<EmpheralVolumeStore>((set) => ({
    showVolume: false,
    setShowVolume(bool: boolean) {
      set((s) => {
        s.showVolume = bool;
      });
    },
  })),
);
