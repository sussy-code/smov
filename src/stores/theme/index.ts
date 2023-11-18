import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface ThemeStore {
  theme: string | null;
  setTheme(v: string | null): void;
}

export const useThemeStore = create(
  persist(
    immer<ThemeStore>((set) => ({
      theme: null,
      setTheme(v) {
        set((s) => {
          s.theme = v;
        });
      },
    })),
    {
      name: "__MW::theme",
    }
  )
);
