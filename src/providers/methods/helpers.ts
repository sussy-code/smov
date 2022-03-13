import { MWMediaType, MWMediaProviderMetadata } from "providers";
import { MWMedia, MWMediaEpisode, MWMediaSeason } from "providers/types";
import { mediaProviders, mediaProvidersUnchecked } from "./providers";

/*
 ** Fetch all enabled providers for a specific type
 */
export function GetProvidersForType(type: MWMediaType) {
  return mediaProviders.filter((v) => v.type.includes(type));
}

/*
 ** Get a provider by a id
 */
export function getProviderFromId(id: string) {
  return mediaProviders.find((v) => v.id === id);
}

/*
 ** Get a provider metadata
 */
export function getProviderMetadata(id: string): MWMediaProviderMetadata {
  const provider = mediaProvidersUnchecked.find((v) => v.id === id);

  if (!provider) {
    return {
      exists: false,
      type: [],
      enabled: false,
      id,
    };
  }

  return {
    exists: true,
    type: provider.type,
    enabled: provider.enabled,
    id,
    provider,
  };
}

/*
 ** get episode and season from media
 */
export function getEpisodeFromMedia(
  media: MWMedia
): { season: MWMediaSeason; episode: MWMediaEpisode } | null {
  if (
    media.seasonId === undefined ||
    media.episodeId === undefined ||
    media.seriesData === undefined
  ) {
    return null;
  }

  const season = media.seriesData.seasons.find((v) => v.id === media.seasonId);
  if (!season) return null;
  const episode = season?.episodes.find((v) => v.id === media.episodeId);
  if (!episode) return null;
  return {
    season,
    episode,
  };
}
