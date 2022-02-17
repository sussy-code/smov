import { theFlixScraper } from "./list/theflix";
import { MWMedia, MWMediaType, MWPortableMedia, MWQuery } from "./types";
import { MWWrappedMediaProvider, WrapProvider } from "./wrapper";
export * from "./types";

const mediaProvidersUnchecked: MWWrappedMediaProvider[] = [
  WrapProvider(theFlixScraper),
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
export async function SearchProviders(query: MWQuery): Promise<MWMedia[]> {
  const allQueries = GetProvidersForType(query.type).map((provider) =>
    provider.searchForMedia(query)
  );
  const allResults = await Promise.all(allQueries);
  return allResults.flatMap((results) => results);
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
