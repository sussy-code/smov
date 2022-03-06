import { SimpleCache } from "utils/cache";
import { MWPortableMedia } from "providers";
import { MWMediaSeasons } from "providers/types";
import { getProviderFromId } from "./helpers";

// cache
const seasonCache = new SimpleCache<MWPortableMedia, MWMediaSeasons>();
seasonCache.setCompare(
  (a, b) => a.mediaId === b.mediaId && a.providerId === b.providerId
);
seasonCache.initialize();

/*
 ** get season data from a (portable) media object, seasons and episodes will be sorted
 */
export async function getSeasonDataFromMedia(
  media: MWPortableMedia
): Promise<MWMediaSeasons> {
  const provider = getProviderFromId(media.providerId);
  if (!provider) {
    return {
      seasons: [],
    };
  }

  if (seasonCache.has(media)) {
    return seasonCache.get(media) as MWMediaSeasons;
  }

  const seasonData = await provider.getSeasonDataFromMedia(media);
  seasonData.seasons.sort((a, b) => a.seasonNumber - b.seasonNumber);
  seasonData.seasons.forEach((s) =>
    s.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber)
  );

  // cache it
  seasonCache.set(media, seasonData, 60 * 60); // cache it for an hour
  return seasonData;
}
