import countryLanguages, { LanguageObj } from "@ladjs/country-language";
import { getTag } from "@sozialhelden/ietf-language-tags";

const languageOrder = ["en", "hi", "fr", "de", "nl", "pt"];

// mapping of language code to country code.
// multiple mappings can exist, since languages are spoken in multiple countries.
// This mapping purely exists to prioritize a country over another in languages where the
// base language code does not contain a region (i.e. if the language code is zh-Hant where Hant is a script)
// iso639_1 -> iso3166 Alpha-2
const countryPriority: Record<string, string> = {
  zh: "cn",
};

// list of iso639_1 Alpha-2 codes used as default languages
const defaultLanguageCodes: string[] = [
  "en-US",
  "cs-CZ",
  "de-DE",
  "fr-FR",
  "pt-BR",
  "it-IT",
  "nl-NL",
  "pl-PL",
  "tr-TR",
  "vi-VN",
  "zh-CN",
  "he-IL",
  "sv-SE",
  "lv-LV",
  "th-TH",
  "ne-NP",
  "ar-SA",
  "es-ES",
  "et-EE",
  "bg-BG",
  "bn-BD",
  "el-GR",
  "fa-IR",
  "gu-IN",
  "id-ID",
  "ja-JP",
  "ko-KR",
  "sl-SI",
  "ta-LK",
  "ru-RU",
  "gl-ES",
];

export interface LocaleInfo {
  name: string;
  nativeName?: string;
  code: string;
  isRtl?: boolean;
}

const extraLanguages: Record<string, LocaleInfo> = {
  pirate: {
    code: "pirate",
    name: "Pirate",
    nativeName: "Pirate Tongue",
  },
  minion: {
    code: "minion",
    name: "Minion",
    nativeName: "Minionese",
  },
  tok: {
    code: "tok",
    name: "Toki pona",
    nativeName: "Toki pona",
  },
};

function populateLanguageCode(language: string): string {
  if (language.includes("-")) return language;
  if (language.length !== 2) return language;
  return (
    defaultLanguageCodes.find((v) => v.startsWith(`${language}-`)) ?? language
  );
}

/**
 * @param locale idk what kinda code this takes, anything in ietf format I guess
 * @returns pretty format for language, null if it no info can be found for language
 */
export function getPrettyLanguageNameFromLocale(locale: string): string | null {
  const tag = getTag(populateLanguageCode(locale), true);
  const lang = tag?.language?.Description?.[0] ?? null;
  if (!lang) return null;

  const region = tag?.region?.Description?.[0] ?? null;
  let regionText = "";
  if (region) regionText = ` (${region})`;

  return `${lang}${regionText}`;
}

/**
 * Sort locale codes by occurrence, rest on alphabetical order
 * @param langCodes list language codes to sort
 * @returns sorted version of inputted list
 */
export function sortLangCodes(langCodes: string[]) {
  const languagesOrder = [...languageOrder].reverse(); // Reverse is necessary, not sure why

  const results = langCodes.sort((a, b) => {
    const langOrderA = languagesOrder.findIndex(
      (v) => a.startsWith(`${v}-`) || a === v,
    );
    const langOrderB = languagesOrder.findIndex(
      (v) => b.startsWith(`${v}-`) || b === v,
    );
    if (langOrderA !== -1 || langOrderB !== -1) return langOrderB - langOrderA;

    return a.localeCompare(b);
  });

  return results;
}

/**
 * Get country code for locale
 * @param locale input locale
 * @returns country code or null
 */
export function getCountryCodeForLocale(locale: string): string | null {
  let output: LanguageObj | null = null as any as LanguageObj;
  const tag = getTag(locale, true);

  if (!tag?.language?.Subtag) return null;
  // this function isn't async, so its guaranteed to work like this
  countryLanguages.getLanguage(tag.language.Subtag, (_err, lang) => {
    if (lang) output = lang;
  });

  if (!output) return null;
  const priority = countryPriority[output.iso639_1.toLowerCase()];
  if (output.countries.length === 0) {
    return priority ?? null;
  }

  // If the language contains a region, check that against the countries and
  // return the region if it matches
  const regionSubtag = tag?.region?.Subtag.toLowerCase();
  if (regionSubtag) {
    const regionCode = output.countries.find(
      (c) =>
        c.code_2.toLowerCase() === regionSubtag ||
        c.code_3.toLowerCase() === regionSubtag,
    );
    if (regionCode) return regionCode.code_2.toLowerCase();
  }

  if (priority) {
    const prioritizedCountry = output.countries.find(
      (v) => v.code_2.toLowerCase() === priority,
    );
    if (prioritizedCountry) return prioritizedCountry.code_2.toLowerCase();
  }
  return output.countries[0].code_2.toLowerCase();
}

/**
 * Get information for a specific local
 * @param locale local code
 * @returns locale object
 */
export function getLocaleInfo(locale: string): LocaleInfo | null {
  const realLocale = populateLanguageCode(locale);
  const extraLang = extraLanguages[realLocale];
  if (extraLang) return extraLang;

  const tag = getTag(realLocale, true);
  if (!tag?.language?.Subtag) return null;

  let output: LanguageObj | null = null as any as LanguageObj;
  // this function isnt async, so its garuanteed to work like this
  countryLanguages.getLanguage(tag.language.Subtag, (_err, lang) => {
    if (lang) output = lang;
  });
  if (!output) return null;

  const extras = [];
  if (tag.region?.Description) extras.push(tag.region.Description[0]);
  if (tag.script?.Description) extras.push(tag.script.Description[0]);
  const extraStringified = extras.map((v) => `(${v})`).join(" ");

  return {
    code: tag.parts.langtag ?? realLocale,
    isRtl: output.direction === "RTL",
    name: output.name[0] + (extraStringified ? ` ${extraStringified}` : ""),
    nativeName: output.nativeName[0] ?? undefined,
  };
}
