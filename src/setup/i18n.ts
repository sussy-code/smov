import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Languages
import en from "./locales/en/translation.json";
import nl from "./locales/nl/translation.json";
import tr from "./locales/tr/translation.json";
import fr from "./locales/fr/translation.json";

import { captionLanguages } from "./iso6391";

const locales = {
  en: {
    translation: en,
  },
  nl: {
    translation: nl,
  },
  tr: {
    translation: tr,
  },
  fr: {
    translation: fr,
  },
};
i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",
    resources: locales,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export const appLanguageOptions = captionLanguages.filter((x) => {
  return Object.keys(locales).includes(x.id);
});

export default i18n;
