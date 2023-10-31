import { useEffect } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import i18n from "@/setup/i18n";

export interface LanguageStore {
  language: string;
  setLanguage(v: string): void;
}

export const useLanguageStore = create(
  immer<LanguageStore>((set) => ({
    language: "en",
    setLanguage(v) {
      set((s) => {
        s.language = v;
      });
    },
  }))
);

export function useLanguageListener() {
  const language = useLanguageStore((s) => s.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);
}
