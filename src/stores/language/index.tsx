import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { rtlLocales } from "@/assets/languages";
import i18n from "@/setup/i18n";

export interface LanguageStore {
  language: string;
  setLanguage(v: string): void;
}

export const useLanguageStore = create(
  persist(
    immer<LanguageStore>((set) => ({
      language: "en",
      setLanguage(v) {
        set((s) => {
          s.language = v;
        });
      },
    })),
    { name: "__MW::locale" },
  ),
);

export function LanguageProvider() {
  const language = useLanguageStore((s) => s.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const isRtl = rtlLocales.includes(language as any);

  return (
    <Helmet>
      <html dir={isRtl ? "rtl" : "ltr"} />
    </Helmet>
  );
}
