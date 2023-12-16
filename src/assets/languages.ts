import cs from "@/assets/locales/cs.json";
import de from "@/assets/locales/de.json";
import en from "@/assets/locales/en.json";
import fr from "@/assets/locales/fr.json";
import it from "@/assets/locales/it.json";
import minion from "@/assets/locales/minion.json";
import nl from "@/assets/locales/nl.json";
import pirate from "@/assets/locales/pirate.json";
import pl from "@/assets/locales/pl.json";
import tr from "@/assets/locales/tr.json";
import vi from "@/assets/locales/vi.json";
import zh from "@/assets/locales/zh.json";

export const locales = {
  en,
  cs,
  de,
  fr,
  it,
  nl,
  pl,
  tr,
  vi,
  zh,
  pirate,
  minion,
};
export type Locales = keyof typeof locales;

export const rtlLocales: Locales[] = [];
