import { getLegacyMetaFromId } from "@/backend/metadata/getmeta";
import {
  getEpisodes,
  getMediaDetails,
  getMovieFromExternalId,
} from "@/backend/metadata/tmdb";
import { MWMediaType } from "@/backend/metadata/types/mw";
import { TMDBContentTypes } from "@/backend/metadata/types/tmdb";
import { BookmarkStoreData } from "@/stores/__old/bookmark/types";
import { isNotNull } from "@/utils/typeguard";

import { WatchedStoreData } from "../types";

async function migrateId(
  id: string,
  type: MWMediaType,
): Promise<string | undefined> {
  const meta = await getLegacyMetaFromId(type, id);

  if (!meta) return undefined;
  const { tmdbId, imdbId } = meta;
  if (!tmdbId && !imdbId) return undefined;

  // movies always have an imdb id on tmdb
  if (imdbId && type === MWMediaType.MOVIE) {
    const movieId = await getMovieFromExternalId(imdbId);
    if (movieId) return movieId;
  }

  if (tmdbId) {
    return tmdbId;
  }
}

export async function migrateV2Bookmarks(old: BookmarkStoreData) {
  const updatedBookmarks = old.bookmarks.map(async (item) => ({
    ...item,
    id: await migrateId(item.id, item.type).catch(() => undefined),
  }));

  return {
    bookmarks: (await Promise.all(updatedBookmarks)).filter((item) => item.id),
  };
}

export async function migrateV3Videos(
  old: WatchedStoreData,
): Promise<WatchedStoreData> {
  const updatedItems = await Promise.all(
    old.items.map(async (progress) => {
      try {
        const migratedId = await migrateId(
          progress.item.meta.id,
          progress.item.meta.type,
        );

        if (!migratedId) return null;

        const clone = structuredClone(progress);
        clone.item.meta.id = migratedId;
        if (clone.item.series) {
          const series = clone.item.series;
          const details = await getMediaDetails(
            migratedId,
            TMDBContentTypes.TV,
          );

          const season = details.seasons.find(
            (v) => v.season_number === series.season,
          );
          if (!season) return null;

          const episodes = await getEpisodes(migratedId, season.season_number);
          const episode = episodes.find(
            (v) => v.episode_number === series.episode,
          );
          if (!episode) return null;

          clone.item.series.episodeId = episode.id.toString();
          clone.item.series.seasonId = season.id.toString();
        }

        return clone;
      } catch (err) {
        return null;
      }
    }),
  );

  return {
    items: updatedItems.filter(isNotNull),
  };
}
