import { theFlixScraper } from "./list/theflix";
import { MWMediaProvider, MWQuery } from "./types";
export * from "./types";

const mediaProvidersUnchecked: MWMediaProvider[] = [
  theFlixScraper
]
export const mediaProviders: MWMediaProvider[] = mediaProvidersUnchecked.filter(v=>v.enabled);

export async function SearchProviders(query: MWQuery) {
  const allQueries = mediaProviders.map(provider => provider.searchForMedia(query));
  const allResults = await Promise.all(allQueries);

  return allResults.flatMap(results => results);
}

export function GetProviderFromId(id: string) {
  return mediaProviders.find(v=>v.id===id);
}
