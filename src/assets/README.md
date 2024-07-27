# About the languages

Locales are difficult, here is some guidance.

## Process on adding new languages
1. Use [Weblate](https://docs.undi.rest/links/weblate) to add translations, see contributing guidelines.
2. Add your language to `@/assets/languages.ts`. Must be in ISO format (ISO-639 for language and ISO-3166 for country/region). For joke languages, use any format.
3. If the language code doesn't have a region specified (Such as in `pt-BR`, `BR` being the region), add a default region in `@/utils/language.ts` at `defaultLanguageCodes`
4. If the language code doesn't contain a region (Such as in `zh-Hant`), add a default country in `@/utils/language.ts` at `countryPriority`.
