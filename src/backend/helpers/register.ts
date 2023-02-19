import { MWEmbedScraper, MWEmbedType } from "./embed";
import { MWProvider } from "./provider";

let providers: MWProvider[] = [];
let embeds: MWEmbedScraper[] = [];

export function registerProvider(provider: MWProvider) {
  if (provider.disabled) return;
  providers.push(provider);
}
export function registerEmbedScraper(embed: MWEmbedScraper) {
  if (embed.disabled) return;
  embeds.push(embed);
}

export function initializeScraperStore() {
  // sort by ranking
  providers = providers.sort((a, b) => b.rank - a.rank);
  embeds = embeds.sort((a, b) => b.rank - a.rank);

  // check for invalid ranks
  let lastRank: null | number = null;
  providers.forEach((v) => {
    if (lastRank === null) {
      lastRank = v.rank;
      return;
    }
    if (lastRank === v.rank)
      throw new Error(`Duplicate rank number for provider ${v.id}`);
    lastRank = v.rank;
  });
  lastRank = null;
  providers.forEach((v) => {
    if (lastRank === null) {
      lastRank = v.rank;
      return;
    }
    if (lastRank === v.rank)
      throw new Error(`Duplicate rank number for embed scraper ${v.id}`);
    lastRank = v.rank;
  });

  // check for duplicate ids
  const providerIds = providers.map((v) => v.id);
  if (
    providerIds.length > 0 &&
    new Set(providerIds).size !== providerIds.length
  )
    throw new Error("Duplicate IDS in providers");
  const embedIds = embeds.map((v) => v.id);
  if (embedIds.length > 0 && new Set(embedIds).size !== embedIds.length)
    throw new Error("Duplicate IDS in embed scrapers");

  // check for duplicate embed types
  const embedTypes = embeds.map((v) => v.for);
  if (embedTypes.length > 0 && new Set(embedTypes).size !== embedTypes.length)
    throw new Error("Duplicate types in embed scrapers");
}

export function getProviders(): MWProvider[] {
  return providers;
}

export function getEmbeds(): MWEmbedScraper[] {
  return embeds;
}

export function getEmbedScraperByType(
  type: MWEmbedType
): MWEmbedScraper | null {
  return getEmbeds().find((v) => v.for === type) ?? null;
}
