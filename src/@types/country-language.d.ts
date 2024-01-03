declare module "@ladjs/country-language" {
  export interface LanguageObj {
    countries: Array<{
      code_2: string;
      code_3: string;
      numCode: string;
    }>;
    direction: "RTL" | "LTR";
    name: string[];
    nativeName: string[];
    iso639_1: string;
  }

  type Callback<T> = (err: null | string, result: null | T) => void;

  declare namespace lib {
    function getLanguage(locale: string, cb: Callback<LanguageObj>): void;
  }

  export = lib;
}
