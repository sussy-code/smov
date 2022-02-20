import Fuse from "fuse.js";
import { tempScraper } from "./list/temp";
import { theFlixScraper } from "./list/theflix";
import {
  MWMassProviderOutput,
  MWMedia,
  MWMediaType,
  MWPortableMedia,
  MWQuery,
} from "./types";
import { MWWrappedMediaProvider, WrapProvider } from "./wrapper";
export * from "./types";

const mediaProvidersUnchecked: MWWrappedMediaProvider[] = [
  WrapProvider(theFlixScraper),
  WrapProvider(tempScraper),
];
export const mediaProviders: MWWrappedMediaProvider[] =
  mediaProvidersUnchecked.filter((v) => v.enabled);

/*
 ** Fetch all enabled providers for a specific type
 */
export function GetProvidersForType(type: MWMediaType) {
  return mediaProviders.filter((v) => v.type.includes(type));
}

/*
 ** Call search on all providers that matches query type
 */
export async function SearchProviders(
  query: MWQuery
): Promise<MWMassProviderOutput> {
  const allQueries = GetProvidersForType(query.type).map<
    Promise<{ media: MWMedia[]; success: boolean; id: string }>
  >(async (provider) => {
    try {
      return {
        media: await provider.searchForMedia(query),
        success: true,
        id: provider.id,
      };
    } catch (err) {
      console.error(`Failed running provider ${provider.id}`, err, query);
      return {
        media: [],
        success: false,
        id: provider.id,
      };
    }
  });
  const allResults = await Promise.all(allQueries);
  const providerResults = allResults.map((provider) => ({
    success: provider.success,
    id: provider.id,
  }));
  const output = {
    results: allResults.flatMap((results) => results.media),
    providers: providerResults,
    stats: {
      total: providerResults.length,
      failed: providerResults.filter((v) => !v.success).length,
      succeeded: providerResults.filter((v) => v.success).length,
    },
  };

  // sort results
  const fuse = new Fuse(output.results, { threshold: 0.3, keys: ["title"] });
  output.results = fuse.search(query.searchQuery).map((v) => v.item);

  if (output.stats.total === output.stats.failed)
    throw new Error("All Scrapers failed");
  return output;
}

/*
 ** Get a provider by a id
 */
export function getProviderFromId(id: string) {
  return mediaProviders.find((v) => v.id === id);
}

/*
 ** Turn media object into a portable media object
 */
export function convertMediaToPortable(media: MWMedia): MWPortableMedia {
  return {
    mediaId: media.mediaId,
    providerId: media.providerId,
    mediaType: media.mediaType,
    episode: media.episode,
    season: media.season,
  };
}

/*
 ** Turn portable media into media object
 */
export async function convertPortableToMedia(
  portable: MWPortableMedia
): Promise<MWMedia | undefined> {
  const provider = getProviderFromId(portable.providerId);
  return await provider?.getMediaFromPortable(portable);
}
