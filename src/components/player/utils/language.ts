import { getTag } from "@sozialhelden/ietf-language-tags";

export function getLanguageFromIETF(ietf: string): string | null {
  const tag = getTag(ietf, true);

  const lang = tag?.language?.Description?.[0] ?? null;
  if (!lang) return null;

  const region = tag?.region?.Description?.[0] ?? null;
  let regionText = "";
  if (region) regionText = ` (${region})`;

  return `${lang}${regionText}`;
}
