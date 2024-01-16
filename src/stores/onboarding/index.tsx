import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface OnboardingStore {
  skipped: boolean;
  setSkipped(v: boolean): void;
}

export const useOnboardingStore = create(
  persist(
    immer<OnboardingStore>((set) => ({
      skipped: false,
      setSkipped(v) {
        set((s) => {
          s.skipped = v;
        });
      },
    })),
    { name: "__MW::onboarding" },
  ),
);
