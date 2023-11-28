import { allThemes } from "./all";

export { defaultTheme } from "./default";
export { allThemes } from "./all";

export const safeThemeList = allThemes
  .flatMap(v=>v.selectors)
  .filter(v=>v.startsWith("."))
  .map(v=>v.slice(1)); // remove dot from selector
