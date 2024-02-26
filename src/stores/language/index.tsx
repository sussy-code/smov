import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import i18n from "@/setup/i18n";
import { getLocaleInfo } from "@/utils/language";

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

export function changeAppLanguage(language: string) {
  const lang = getLocaleInfo(language);
  if (lang) i18n.changeLanguage(lang.code);
}

export function isRightToLeft(language: string) {
  const lang = getLocaleInfo(language);
  if (!lang) return false;
  return lang.isRtl;
}

export function LanguageProvider() {
  const language = useLanguageStore((s) => s.language);

  useEffect(() => {
    changeAppLanguage(language);
  }, [language]);

  const isRtl = isRightToLeft(language);

  return (
    <Helmet>
      <html dir={isRtl ? "rtl" : "ltr"} />
    </Helmet>
  );
}
