import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface OverlayTransition {
  from: string;
  to: string;
}

interface OverlayStore {
  transition: null | OverlayTransition;
  setTransition(newTrans: OverlayTransition | null): void;
}

export const useOverlayStore = create(
  immer<OverlayStore>((set) => ({
    transition: null,
    setTransition(newTrans) {
      set((s) => {
        s.transition = newTrans;
      });
    },
  }))
);
