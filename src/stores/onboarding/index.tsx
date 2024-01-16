import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface OnboardingStore {
  completed: boolean;
  setCompleted(v: boolean): void;
}

export const useOnboardingStore = create(
  persist(
    immer<OnboardingStore>((set) => ({
      completed: false,
      setCompleted(v) {
        set((s) => {
          s.completed = v;
        });
      },
    })),
    { name: "__MW::onboarding" },
  ),
);
