# About the languages

Locales are difficult, here is some guidance.

## Process on adding new languages
1. Use weblate to add translations, see contributing guidelines.
2. Add your language to `@/assets/languages.ts`. Must be iso format. For joke languages, use any format.
3. If you language doesn't have a region specified. Add a default region in `@/utils/language.ts` at `defaultLanguageCodes`
4. If the flag in the language dropdown doesn't match the correct one. Add a default country in `@/utils/language.ts` at `countryPriority`.
