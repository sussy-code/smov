import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Languages
import { captionLanguages } from "./iso6391";
import cs from "./locales/cs/translation.json";
import de from "./locales/de/translation.json";
import en from "./locales/en/translation.json";
import fr from "./locales/fr/translation.json";
import it from "./locales/it/translation.json";
import nl from "./locales/nl/translation.json";
import pirate from "./locales/pirate/translation.json";
import pl from "./locales/pl/translation.json";
import tr from "./locales/tr/translation.json";
import vi from "./locales/vi/translation.json";
import zh from "./locales/zh/translation.json";

const locales = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
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
  de: {
    translation: de,
  },
  zh: {
    translation: zh,
  },
  cs: {
    translation: cs,
  },
  pirate: {
    translation: pirate,
  },
  vi: {
    translation: vi,
  },
  pl: {
    translation: pl,
  },
};
i18n
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
