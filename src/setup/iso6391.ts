export type LangCode =
  | "none"
  | "pirate"
  | "aa"
  | "ab"
  | "ae"
  | "af"
  | "ak"
  | "am"
  | "an"
  | "ar"
  | "as"
  | "av"
  | "ay"
  | "az"
  | "ba"
  | "be"
  | "bg"
  | "bh"
  | "bi"
  | "bm"
  | "bn"
  | "bo"
  | "br"
  | "bs"
  | "ca"
  | "ce"
  | "ch"
  | "co"
  | "cr"
  | "cs"
  | "cu"
  | "cv"
  | "cy"
  | "da"
  | "de"
  | "dv"
  | "dz"
  | "ee"
  | "el"
  | "en"
  | "eo"
  | "es"
  | "et"
  | "eu"
  | "fa"
  | "ff"
  | "fi"
  | "fj"
  | "fo"
  | "fr"
  | "fy"
  | "ga"
  | "gd"
  | "gl"
  | "gn"
  | "gu"
  | "gv"
  | "ha"
  | "he"
  | "hi"
  | "ho"
  | "hr"
  | "ht"
  | "hu"
  | "hy"
  | "hz"
  | "ia"
  | "id"
  | "ie"
  | "ig"
  | "ii"
  | "ik"
  | "io"
  | "is"
  | "it"
  | "iu"
  | "ja"
  | "jv"
  | "ka"
  | "kg"
  | "ki"
  | "kj"
  | "kk"
  | "kl"
  | "km"
  | "kn"
  | "ko"
  | "kr"
  | "ks"
  | "ku"
  | "kv"
  | "kw"
  | "ky"
  | "la"
  | "lb"
  | "lg"
  | "li"
  | "ln"
  | "lo"
  | "lt"
  | "lu"
  | "lv"
  | "mg"
  | "mh"
  | "mi"
  | "mk"
  | "ml"
  | "mn"
  | "mr"
  | "ms"
  | "mt"
  | "my"
  | "na"
  | "nb"
  | "nd"
  | "ne"
  | "ng"
  | "nl"
  | "nn"
  | "no"
  | "nr"
  | "nv"
  | "ny"
  | "oc"
  | "oj"
  | "om"
  | "or"
  | "os"
  | "pa"
  | "pi"
  | "pl"
  | "ps"
  | "pt"
  | "qu"
  | "rm"
  | "rn"
  | "ro"
  | "ru"
  | "rw"
  | "sa"
  | "sc"
  | "sd"
  | "se"
  | "sg"
  | "si"
  | "sk"
  | "sl"
  | "sm"
  | "sn"
  | "so"
  | "sq"
  | "sr"
  | "ss"
  | "st"
  | "su"
  | "sv"
  | "sw"
  | "ta"
  | "te"
  | "tg"
  | "th"
  | "ti"
  | "tk"
  | "tl"
  | "tn"
  | "to"
  | "tr"
  | "ts"
  | "tt"
  | "tw"
  | "ty"
  | "ug"
  | "uk"
  | "ur"
  | "uz"
  | "ve"
  | "vi"
  | "vo"
  | "wa"
  | "wo"
  | "xh"
  | "yi"
  | "yo"
  | "za"
  | "zh"
  | "zu";
export type CaptionLanguageOption = {
  id: LangCode;
  name: string;
  englishName: string;
  nativeName: string;
};
// https://github.com/emvi/iso-639-1/blob/master/list.go
// MIT License
//
// Copyright (c) 2019 Emvi
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
export const captionLanguages: CaptionLanguageOption[] = [
  {
    id: "none",
    englishName: "None",
    name: "None",
    nativeName: "Lorem ipsum",
  },
  {
    id: "pirate",
    englishName: "Pirate",
    name: "Pirate English",
    nativeName: "Pirate English",
  },
  {
    id: "aa",
    englishName: "Afar",
    name: "Afar - Afaraf",
    nativeName: "Afaraf",
  },
  {
    id: "ab",
    englishName: "Abkhaz",
    name: "Abkhaz - Аҧсуа бызшәа",
    nativeName: "Аҧсуа бызшәа",
  },
  {
    id: "ae",
    englishName: "Avestan",
    name: "Avestan - Avesta",
    nativeName: "Avesta",
  },
  {
    id: "af",
    englishName: "Afrikaans",
    name: "Afrikaans - Afrikaans",
    nativeName: "Afrikaans",
  },
  {
    id: "ak",
    englishName: "Akan",
    name: "Akan - Akan",
    nativeName: "Akan",
  },
  {
    id: "am",
    englishName: "Amharic",
    name: "Amharic - አማርኛ",
    nativeName: "አማርኛ",
  },
  {
    id: "an",
    englishName: "Aragonese",
    name: "Aragonese - Aragonés",
    nativeName: "Aragonés",
  },
  {
    id: "ar",
    englishName: "Arabic",
    name: "Arabic - اللغة العربية",
    nativeName: "اللغة العربية",
  },
  {
    id: "as",
    englishName: "Assamese",
    name: "Assamese - অসমীয়া",
    nativeName: "অসমীয়া",
  },
  {
    id: "av",
    englishName: "Avaric",
    name: "Avaric - Авар мацӀ",
    nativeName: "Авар мацӀ",
  },
  {
    id: "ay",
    englishName: "Aymara",
    name: "Aymara - Aymar aru",
    nativeName: "Aymar aru",
  },
  {
    id: "az",
    englishName: "Azerbaijani",
    name: "Azerbaijani - Azərbaycan dili",
    nativeName: "Azərbaycan dili",
  },
  {
    id: "ba",
    englishName: "Bashkir",
    name: "Bashkir - Башҡорт теле",
    nativeName: "Башҡорт теле",
  },
  {
    id: "be",
    englishName: "Belarusian",
    name: "Belarusian - Беларуская мова",
    nativeName: "Беларуская мова",
  },
  {
    id: "bg",
    englishName: "Bulgarian",
    name: "Bulgarian - Български език",
    nativeName: "Български език",
  },
  {
    id: "bh",
    englishName: "Bihari",
    name: "Bihari - भोजपुरी",
    nativeName: "भोजपुरी",
  },
  {
    id: "bi",
    englishName: "Bislama",
    name: "Bislama - Bislama",
    nativeName: "Bislama",
  },
  {
    id: "bm",
    englishName: "Bambara",
    name: "Bambara - Bamanankan",
    nativeName: "Bamanankan",
  },
  {
    id: "bn",
    englishName: "Bengali",
    name: "Bengali - বাংলা",
    nativeName: "বাংলা",
  },
  {
    id: "bo",
    englishName: "Tibetan Standard",
    name: "Tibetan Standard - བོད་ཡིག",
    nativeName: "བོད་ཡིག",
  },
  {
    id: "br",
    englishName: "Breton",
    name: "Breton - Brezhoneg",
    nativeName: "Brezhoneg",
  },
  {
    id: "bs",
    englishName: "Bosnian",
    name: "Bosnian - Bosanski jezik",
    nativeName: "Bosanski jezik",
  },
  {
    id: "ca",
    englishName: "Catalan",
    name: "Catalan - Català",
    nativeName: "Català",
  },
  {
    id: "ce",
    englishName: "Chechen",
    name: "Chechen - Нохчийн мотт",
    nativeName: "Нохчийн мотт",
  },
  {
    id: "ch",
    englishName: "Chamorro",
    name: "Chamorro - Chamoru",
    nativeName: "Chamoru",
  },
  {
    id: "co",
    englishName: "Corsican",
    name: "Corsican - Corsu",
    nativeName: "Corsu",
  },
  {
    id: "cr",
    englishName: "Cree",
    name: "Cree - ᓀᐦᐃᔭᐍᐏᐣ",
    nativeName: "ᓀᐦᐃᔭᐍᐏᐣ",
  },
  {
    id: "cs",
    englishName: "Czech",
    name: "Czech - Čeština",
    nativeName: "Čeština",
  },
  {
    id: "cu",
    englishName: "Old Church Slavonic",
    name: "Old Church Slavonic - Ѩзыкъ словѣньскъ",
    nativeName: "Ѩзыкъ словѣньскъ",
  },
  {
    id: "cv",
    englishName: "Chuvash",
    name: "Chuvash - Чӑваш чӗлхи",
    nativeName: "Чӑваш чӗлхи",
  },
  {
    id: "cy",
    englishName: "Welsh",
    name: "Welsh - Cymraeg",
    nativeName: "Cymraeg",
  },
  {
    id: "da",
    englishName: "Danish",
    name: "Danish - Dansk",
    nativeName: "Dansk",
  },
  {
    id: "de",
    englishName: "German",
    name: "German - Deutsch",
    nativeName: "Deutsch",
  },
  {
    id: "dv",
    englishName: "Divehi",
    name: "Divehi - Dhivehi",
    nativeName: "Dhivehi",
  },
  {
    id: "dz",
    englishName: "Dzongkha",
    name: "Dzongkha - རྫོང་ཁ",
    nativeName: "རྫོང་ཁ",
  },
  {
    id: "ee",
    englishName: "Ewe",
    name: "Ewe - Eʋegbe",
    nativeName: "Eʋegbe",
  },
  {
    id: "el",
    englishName: "Greek",
    name: "Greek - Ελληνικά",
    nativeName: "Ελληνικά",
  },
  {
    id: "en",
    englishName: "English",
    name: "English - English",
    nativeName: "English",
  },
  {
    id: "eo",
    englishName: "Esperanto",
    name: "Esperanto - Esperanto",
    nativeName: "Esperanto",
  },
  {
    id: "es",
    englishName: "Spanish",
    name: "Spanish - Español",
    nativeName: "Español",
  },
  {
    id: "et",
    englishName: "Estonian",
    name: "Estonian - Eesti",
    nativeName: "Eesti",
  },
  {
    id: "eu",
    englishName: "Basque",
    name: "Basque - Euskara",
    nativeName: "Euskara",
  },
  {
    id: "fa",
    englishName: "Persian",
    name: "Persian - فارسی",
    nativeName: "فارسی",
  },
  {
    id: "ff",
    englishName: "Fula",
    name: "Fula - Fulfulde",
    nativeName: "Fulfulde",
  },
  {
    id: "fi",
    englishName: "Finnish",
    name: "Finnish - Suomi",
    nativeName: "Suomi",
  },
  {
    id: "fj",
    englishName: "Fijian",
    name: "Fijian - Vakaviti",
    nativeName: "Vakaviti",
  },
  {
    id: "fo",
    englishName: "Faroese",
    name: "Faroese - Føroyskt",
    nativeName: "Føroyskt",
  },
  {
    id: "fr",
    englishName: "French",
    name: "French - Français",
    nativeName: "Français",
  },
  {
    id: "fy",
    englishName: "Western Frisian",
    name: "Western Frisian - Frysk",
    nativeName: "Frysk",
  },
  {
    id: "ga",
    englishName: "Irish",
    name: "Irish - Gaeilge",
    nativeName: "Gaeilge",
  },
  {
    id: "gd",
    englishName: "Scottish Gaelic",
    name: "Scottish Gaelic - Gàidhlig",
    nativeName: "Gàidhlig",
  },
  {
    id: "gl",
    englishName: "Galician",
    name: "Galician - Galego",
    nativeName: "Galego",
  },
  {
    id: "gn",
    englishName: "Guaraní",
    name: "Guaraní - Avañeẽ",
    nativeName: "Avañeẽ",
  },
  {
    id: "gu",
    englishName: "Gujarati",
    name: "Gujarati - ગુજરાતી",
    nativeName: "ગુજરાતી",
  },
  {
    id: "gv",
    englishName: "Manx",
    name: "Manx - Gaelg",
    nativeName: "Gaelg",
  },
  {
    id: "ha",
    englishName: "Hausa",
    name: "Hausa - هَوُسَ",
    nativeName: "هَوُسَ",
  },
  {
    id: "he",
    englishName: "Hebrew",
    name: "Hebrew - עברית",
    nativeName: "עברית",
  },
  {
    id: "hi",
    englishName: "Hindi",
    name: "Hindi - हिन्दी",
    nativeName: "हिन्दी",
  },
  {
    id: "ho",
    englishName: "Hiri Motu",
    name: "Hiri Motu - Hiri Motu",
    nativeName: "Hiri Motu",
  },
  {
    id: "hr",
    englishName: "Croatian",
    name: "Croatian - Hrvatski jezik",
    nativeName: "Hrvatski jezik",
  },
  {
    id: "ht",
    englishName: "Haitian",
    name: "Haitian - Kreyòl ayisyen",
    nativeName: "Kreyòl ayisyen",
  },
  {
    id: "hu",
    englishName: "Hungarian",
    name: "Hungarian - Magyar",
    nativeName: "Magyar",
  },
  {
    id: "hy",
    englishName: "Armenian",
    name: "Armenian - Հայերեն",
    nativeName: "Հայերեն",
  },
  {
    id: "hz",
    englishName: "Herero",
    name: "Herero - Otjiherero",
    nativeName: "Otjiherero",
  },
  {
    id: "ia",
    englishName: "Interlingua",
    name: "Interlingua - Interlingua",
    nativeName: "Interlingua",
  },
  {
    id: "id",
    englishName: "Indonesian",
    name: "Indonesian - Indonesian",
    nativeName: "Indonesian",
  },
  {
    id: "ie",
    englishName: "Interlingue",
    name: "Interlingue - Interlingue",
    nativeName: "Interlingue",
  },
  {
    id: "ig",
    englishName: "Igbo",
    name: "Igbo - Asụsụ Igbo",
    nativeName: "Asụsụ Igbo",
  },
  {
    id: "ii",
    englishName: "Nuosu",
    name: "Nuosu - ꆈꌠ꒿ Nuosuhxop",
    nativeName: "ꆈꌠ꒿ Nuosuhxop",
  },
  {
    id: "ik",
    englishName: "Inupiaq",
    name: "Inupiaq - Iñupiaq",
    nativeName: "Iñupiaq",
  },
  {
    id: "io",
    englishName: "Ido",
    name: "Ido - Ido",
    nativeName: "Ido",
  },
  {
    id: "is",
    englishName: "Icelandic",
    name: "Icelandic - Íslenska",
    nativeName: "Íslenska",
  },
  {
    id: "it",
    englishName: "Italian",
    name: "Italian - Italiano",
    nativeName: "Italiano",
  },
  {
    id: "iu",
    englishName: "Inuktitut",
    name: "Inuktitut - ᐃᓄᒃᑎᑐᑦ",
    nativeName: "ᐃᓄᒃᑎᑐᑦ",
  },
  {
    id: "ja",
    englishName: "Japanese",
    name: "Japanese - 日本語",
    nativeName: "日本語",
  },
  {
    id: "jv",
    englishName: "Javanese",
    name: "Javanese - Basa Jawa",
    nativeName: "Basa Jawa",
  },
  {
    id: "ka",
    englishName: "Georgian",
    name: "Georgian - Ქართული",
    nativeName: "Ქართული",
  },
  {
    id: "kg",
    englishName: "Kongo",
    name: "Kongo - Kikongo",
    nativeName: "Kikongo",
  },
  {
    id: "ki",
    englishName: "Kikuyu",
    name: "Kikuyu - Gĩkũyũ",
    nativeName: "Gĩkũyũ",
  },
  {
    id: "kj",
    englishName: "Kwanyama",
    name: "Kwanyama - Kuanyama",
    nativeName: "Kuanyama",
  },
  {
    id: "kk",
    englishName: "Kazakh",
    name: "Kazakh - Қазақ тілі",
    nativeName: "Қазақ тілі",
  },
  {
    id: "kl",
    englishName: "Kalaallisut",
    name: "Kalaallisut - Kalaallisut",
    nativeName: "Kalaallisut",
  },
  {
    id: "km",
    englishName: "Khmer",
    name: "Khmer - ខេមរភាសា",
    nativeName: "ខេមរភាសា",
  },
  {
    id: "kn",
    englishName: "Kannada",
    name: "Kannada - ಕನ್ನಡ",
    nativeName: "ಕನ್ನಡ",
  },
  {
    id: "ko",
    englishName: "Korean",
    name: "Korean - 한국어",
    nativeName: "한국어",
  },
  {
    id: "kr",
    englishName: "Kanuri",
    name: "Kanuri - Kanuri",
    nativeName: "Kanuri",
  },
  {
    id: "ks",
    englishName: "Kashmiri",
    name: "Kashmiri - कश्मीरी",
    nativeName: "कश्मीरी",
  },
  {
    id: "ku",
    englishName: "Kurdish",
    name: "Kurdish - Kurdî",
    nativeName: "Kurdî",
  },
  {
    id: "kv",
    englishName: "Komi",
    name: "Komi - Коми кыв",
    nativeName: "Коми кыв",
  },
  {
    id: "kw",
    englishName: "Cornish",
    name: "Cornish - Kernewek",
    nativeName: "Kernewek",
  },
  {
    id: "ky",
    englishName: "Kyrgyz",
    name: "Kyrgyz - Кыргызча",
    nativeName: "Кыргызча",
  },
  {
    id: "la",
    englishName: "Latin",
    name: "Latin - Latine",
    nativeName: "Latine",
  },
  {
    id: "lb",
    englishName: "Luxembourgish",
    name: "Luxembourgish - Lëtzebuergesch",
    nativeName: "Lëtzebuergesch",
  },
  {
    id: "lg",
    englishName: "Ganda",
    name: "Ganda - Luganda",
    nativeName: "Luganda",
  },
  {
    id: "li",
    englishName: "Limburgish",
    name: "Limburgish - Limburgs",
    nativeName: "Limburgs",
  },
  {
    id: "ln",
    englishName: "Lingala",
    name: "Lingala - Lingála",
    nativeName: "Lingála",
  },
  {
    id: "lo",
    englishName: "Lao",
    name: "Lao - ພາສາ",
    nativeName: "ພາສາ",
  },
  {
    id: "lt",
    englishName: "Lithuanian",
    name: "Lithuanian - Lietuvių kalba",
    nativeName: "Lietuvių kalba",
  },
  {
    id: "lu",
    englishName: "Luba-Katanga",
    name: "Luba-Katanga - Tshiluba",
    nativeName: "Tshiluba",
  },
  {
    id: "lv",
    englishName: "Latvian",
    name: "Latvian - Latviešu valoda",
    nativeName: "Latviešu valoda",
  },
  {
    id: "mg",
    englishName: "Malagasy",
    name: "Malagasy - Fiteny malagasy",
    nativeName: "Fiteny malagasy",
  },
  {
    id: "mh",
    englishName: "Marshallese",
    name: "Marshallese - Kajin M̧ajeļ",
    nativeName: "Kajin M̧ajeļ",
  },
  {
    id: "mi",
    englishName: "Māori",
    name: "Māori - Te reo Māori",
    nativeName: "Te reo Māori",
  },
  {
    id: "mk",
    englishName: "Macedonian",
    name: "Macedonian - Македонски јазик",
    nativeName: "Македонски јазик",
  },
  {
    id: "ml",
    englishName: "Malayalam",
    name: "Malayalam - മലയാളം",
    nativeName: "മലയാളം",
  },
  {
    id: "mn",
    englishName: "Mongolian",
    name: "Mongolian - Монгол хэл",
    nativeName: "Монгол хэл",
  },
  {
    id: "mr",
    englishName: "Marathi",
    name: "Marathi - मराठी",
    nativeName: "मराठी",
  },
  {
    id: "ms",
    englishName: "Malay",
    name: "Malay - هاس ملايو‎",
    nativeName: "هاس ملايو‎",
  },
  {
    id: "mt",
    englishName: "Maltese",
    name: "Maltese - Malti",
    nativeName: "Malti",
  },
  {
    id: "my",
    englishName: "Burmese",
    name: "Burmese - ဗမာစာ",
    nativeName: "ဗမာစာ",
  },
  {
    id: "na",
    englishName: "Nauru",
    name: "Nauru - Ekakairũ Naoero",
    nativeName: "Ekakairũ Naoero",
  },
  {
    id: "nb",
    englishName: "Norwegian Bokmål",
    name: "Norwegian Bokmål - Norsk bokmål",
    nativeName: "Norsk bokmål",
  },
  {
    id: "nd",
    englishName: "Northern Ndebele",
    name: "Northern Ndebele - IsiNdebele",
    nativeName: "IsiNdebele",
  },
  {
    id: "ne",
    englishName: "Nepali",
    name: "Nepali - नेपाली",
    nativeName: "नेपाली",
  },
  {
    id: "ng",
    englishName: "Ndonga",
    name: "Ndonga - Owambo",
    nativeName: "Owambo",
  },
  {
    id: "nl",
    englishName: "Dutch",
    name: "Dutch - Nederlands",
    nativeName: "Nederlands",
  },
  {
    id: "nn",
    englishName: "Norwegian Nynorsk",
    name: "Norwegian Nynorsk - Norsk nynorsk",
    nativeName: "Norsk nynorsk",
  },
  {
    id: "no",
    englishName: "Norwegian",
    name: "Norwegian - Norsk",
    nativeName: "Norsk",
  },
  {
    id: "nr",
    englishName: "Southern Ndebele",
    name: "Southern Ndebele - IsiNdebele",
    nativeName: "IsiNdebele",
  },
  {
    id: "nv",
    englishName: "Navajo",
    name: "Navajo - Diné bizaad",
    nativeName: "Diné bizaad",
  },
  {
    id: "ny",
    englishName: "Chichewa",
    name: "Chichewa - ChiCheŵa",
    nativeName: "ChiCheŵa",
  },
  {
    id: "oc",
    englishName: "Occitan",
    name: "Occitan - Occitan",
    nativeName: "Occitan",
  },
  {
    id: "oj",
    englishName: "Ojibwe",
    name: "Ojibwe - ᐊᓂᔑᓈᐯᒧᐎᓐ",
    nativeName: "ᐊᓂᔑᓈᐯᒧᐎᓐ",
  },
  {
    id: "om",
    englishName: "Oromo",
    name: "Oromo - Afaan Oromoo",
    nativeName: "Afaan Oromoo",
  },
  {
    id: "or",
    englishName: "Oriya",
    name: "Oriya - ଓଡ଼ିଆ",
    nativeName: "ଓଡ଼ିଆ",
  },
  {
    id: "os",
    englishName: "Ossetian",
    name: "Ossetian - Ирон æвзаг",
    nativeName: "Ирон æвзаг",
  },
  {
    id: "pa",
    englishName: "Panjabi",
    name: "Panjabi - ਪੰਜਾਬੀ",
    nativeName: "ਪੰਜਾਬੀ",
  },
  {
    id: "pi",
    englishName: "Pāli",
    name: "Pāli - पाऴि",
    nativeName: "पाऴि",
  },
  {
    id: "pl",
    englishName: "Polish",
    name: "Polish - Język polski",
    nativeName: "Język polski",
  },
  {
    id: "ps",
    englishName: "Pashto",
    name: "Pashto - پښتو",
    nativeName: "پښتو",
  },
  {
    id: "pt",
    englishName: "Portuguese",
    name: "Portuguese - Português",
    nativeName: "Português",
  },
  {
    id: "qu",
    englishName: "Quechua",
    name: "Quechua - Runa Simi",
    nativeName: "Runa Simi",
  },
  {
    id: "rm",
    englishName: "Romansh",
    name: "Romansh - Rumantsch grischun",
    nativeName: "Rumantsch grischun",
  },
  {
    id: "rn",
    englishName: "Kirundi",
    name: "Kirundi - Ikirundi",
    nativeName: "Ikirundi",
  },
  {
    id: "ro",
    englishName: "Romanian",
    name: "Romanian - Română",
    nativeName: "Română",
  },
  {
    id: "ru",
    englishName: "Russian",
    name: "Russian - Русский",
    nativeName: "Русский",
  },
  {
    id: "rw",
    englishName: "Kinyarwanda",
    name: "Kinyarwanda - Ikinyarwanda",
    nativeName: "Ikinyarwanda",
  },
  {
    id: "sa",
    englishName: "Sanskrit",
    name: "Sanskrit - संस्कृतम्",
    nativeName: "संस्कृतम्",
  },
  {
    id: "sc",
    englishName: "Sardinian",
    name: "Sardinian - Sardu",
    nativeName: "Sardu",
  },
  {
    id: "sd",
    englishName: "Sindhi",
    name: "Sindhi - सिन्धी",
    nativeName: "सिन्धी",
  },
  {
    id: "se",
    englishName: "Northern Sami",
    name: "Northern Sami - Davvisámegiella",
    nativeName: "Davvisámegiella",
  },
  {
    id: "sg",
    englishName: "Sango",
    name: "Sango - Yângâ tî sängö",
    nativeName: "Yângâ tî sängö",
  },
  {
    id: "si",
    englishName: "Sinhala",
    name: "Sinhala - සිංහල",
    nativeName: "සිංහල",
  },
  {
    id: "sk",
    englishName: "Slovak",
    name: "Slovak - Slovenčina",
    nativeName: "Slovenčina",
  },
  {
    id: "sl",
    englishName: "Slovene",
    name: "Slovene - Slovenski jezik",
    nativeName: "Slovenski jezik",
  },
  {
    id: "sm",
    englishName: "Samoan",
    name: "Samoan - Gagana faa Samoa",
    nativeName: "Gagana faa Samoa",
  },
  {
    id: "sn",
    englishName: "Shona",
    name: "Shona - ChiShona",
    nativeName: "ChiShona",
  },
  {
    id: "so",
    englishName: "Somali",
    name: "Somali - Soomaaliga",
    nativeName: "Soomaaliga",
  },
  {
    id: "sq",
    englishName: "Albanian",
    name: "Albanian - Shqip",
    nativeName: "Shqip",
  },
  {
    id: "sr",
    englishName: "Serbian",
    name: "Serbian - Српски језик",
    nativeName: "Српски језик",
  },
  {
    id: "ss",
    englishName: "Swati",
    name: "Swati - SiSwati",
    nativeName: "SiSwati",
  },
  {
    id: "st",
    englishName: "Southern Sotho",
    name: "Southern Sotho - Sesotho",
    nativeName: "Sesotho",
  },
  {
    id: "su",
    englishName: "Sundanese",
    name: "Sundanese - Basa Sunda",
    nativeName: "Basa Sunda",
  },
  {
    id: "sv",
    englishName: "Swedish",
    name: "Swedish - Svenska",
    nativeName: "Svenska",
  },
  {
    id: "sw",
    englishName: "Swahili",
    name: "Swahili - Kiswahili",
    nativeName: "Kiswahili",
  },
  {
    id: "ta",
    englishName: "Tamil",
    name: "Tamil - தமிழ்",
    nativeName: "தமிழ்",
  },
  {
    id: "te",
    englishName: "Telugu",
    name: "Telugu - తెలుగు",
    nativeName: "తెలుగు",
  },
  {
    id: "tg",
    englishName: "Tajik",
    name: "Tajik - Тоҷикӣ",
    nativeName: "Тоҷикӣ",
  },
  {
    id: "th",
    englishName: "Thai",
    name: "Thai - ไทย",
    nativeName: "ไทย",
  },
  {
    id: "ti",
    englishName: "Tigrinya",
    name: "Tigrinya - ትግርኛ",
    nativeName: "ትግርኛ",
  },
  {
    id: "tk",
    englishName: "Turkmen",
    name: "Turkmen - Türkmen",
    nativeName: "Türkmen",
  },
  {
    id: "tl",
    englishName: "Tagalog",
    name: "Tagalog - Wikang Tagalog",
    nativeName: "Wikang Tagalog",
  },
  {
    id: "tn",
    englishName: "Tswana",
    name: "Tswana - Setswana",
    nativeName: "Setswana",
  },
  {
    id: "to",
    englishName: "Tonga",
    name: "Tonga - Faka Tonga",
    nativeName: "Faka Tonga",
  },
  {
    id: "tr",
    englishName: "Turkish",
    name: "Turkish - Türkçe",
    nativeName: "Türkçe",
  },
  {
    id: "ts",
    englishName: "Tsonga",
    name: "Tsonga - Xitsonga",
    nativeName: "Xitsonga",
  },
  {
    id: "tt",
    englishName: "Tatar",
    name: "Tatar - Татар теле",
    nativeName: "Татар теле",
  },
  {
    id: "tw",
    englishName: "Twi",
    name: "Twi - Twi",
    nativeName: "Twi",
  },
  {
    id: "ty",
    englishName: "Tahitian",
    name: "Tahitian - Reo Tahiti",
    nativeName: "Reo Tahiti",
  },
  {
    id: "ug",
    englishName: "Uyghur",
    name: "Uyghur - ئۇيغۇرچە‎",
    nativeName: "ئۇيغۇرچە‎",
  },
  {
    id: "uk",
    englishName: "Ukrainian",
    name: "Ukrainian - Українська",
    nativeName: "Українська",
  },
  {
    id: "ur",
    englishName: "Urdu",
    name: "Urdu - اردو",
    nativeName: "اردو",
  },
  {
    id: "uz",
    englishName: "Uzbek",
    name: "Uzbek - Ўзбек",
    nativeName: "Ўзбек",
  },
  {
    id: "ve",
    englishName: "Venda",
    name: "Venda - Tshivenḓa",
    nativeName: "Tshivenḓa",
  },
  {
    id: "vi",
    englishName: "Vietnamese",
    name: "Vietnamese - Tiếng Việt",
    nativeName: "Tiếng Việt",
  },
  {
    id: "vo",
    englishName: "Volapük",
    name: "Volapük - Volapük",
    nativeName: "Volapük",
  },
  {
    id: "wa",
    englishName: "Walloon",
    name: "Walloon - Walon",
    nativeName: "Walon",
  },
  {
    id: "wo",
    englishName: "Wolof",
    name: "Wolof - Wollof",
    nativeName: "Wollof",
  },
  {
    id: "xh",
    englishName: "Xhosa",
    name: "Xhosa - IsiXhosa",
    nativeName: "IsiXhosa",
  },
  {
    id: "yi",
    englishName: "Yiddish",
    name: "Yiddish - ייִדיש",
    nativeName: "ייִדיש",
  },
  {
    id: "yo",
    englishName: "Yoruba",
    name: "Yoruba - Yorùbá",
    nativeName: "Yorùbá",
  },
  {
    id: "za",
    englishName: "Zhuang",
    name: "Zhuang - Saɯ cueŋƅ",
    nativeName: "Saɯ cueŋƅ",
  },
  {
    id: "zh",
    englishName: "Chinese",
    name: "Chinese - 中文",
    nativeName: "中文",
  },
  {
    id: "zu",
    englishName: "Zulu",
    name: "Zulu - IsiZulu",
    nativeName: "IsiZulu",
  },
];
