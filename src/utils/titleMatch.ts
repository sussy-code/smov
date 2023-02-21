import { normalizeTitle } from "./normalizeTitle";

export function compareTitle(a: string, b: string): boolean {
  return normalizeTitle(a) === normalizeTitle(b);
}
