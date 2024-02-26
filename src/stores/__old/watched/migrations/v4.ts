import { MWMediaType } from "@/backend/metadata/types/mw";
import { ProgressMediaItem } from "@/stores/progress";

import { WatchedStoreData } from "../types";

export function migrateV4Videos(old: WatchedStoreData) {
  // Convert items
  const newItems: Record<string, ProgressMediaItem> = {};

  for (const oldItem of old.items) {
    if (oldItem.item.meta.type === MWMediaType.SERIES) {
      // Upsert
      if (!newItems[oldItem.item.meta.id]) {
        newItems[oldItem.item.meta.id] = {
          type: "show",
          episodes: {},
          seasons: {},
          title: oldItem.item.meta.title,
          updatedAt: oldItem.watchedAt,
          poster: oldItem.item.meta.poster,
          year: Number(oldItem.item.meta.year),
        };
      }

      // Add episodes
      if (
        oldItem.item.series &&
        !newItems[oldItem.item.meta.id].episodes[oldItem.item.series.episodeId]
      ) {
        // Find episode ID (barely ever works)
        const episodeTitle = oldItem.item.meta.seasonData.episodes.find(
          (ep) => ep.number === oldItem.item.series?.episode,
        )?.title;

        // Add season to season data
        newItems[oldItem.item.meta.id].seasons[oldItem.item.series.seasonId] = {
          id: oldItem.item.series.seasonId,
          number: oldItem.item.series.season,
          title:
            oldItem.item.meta.seasons.find(
              (s) => s.number === oldItem.item.series?.season,
            )?.title || "Unknown season",
        };

        // Populate episode data
        newItems[oldItem.item.meta.id].episodes[oldItem.item.series.episodeId] =
          {
            title: episodeTitle || "Unknown",
            id: oldItem.item.series.episodeId,
            number: oldItem.item.series.episode,
            seasonId: oldItem.item.series.seasonId,
            updatedAt: oldItem.watchedAt,
            progress: {
              duration: (100 / oldItem.percentage) * oldItem.progress,
              watched: oldItem.progress,
            },
          };
      }
    } else {
      newItems[oldItem.item.meta.id] = {
        type: "movie",
        episodes: {},
        seasons: {},
        title: oldItem.item.meta.title,
        updatedAt: oldItem.watchedAt,
        year: Number(oldItem.item.meta.year),
        poster: oldItem.item.meta.poster,
        progress: {
          duration: (100 / oldItem.percentage) * oldItem.progress,
          watched: oldItem.progress,
        },
      };
    }
  }

  return newItems;
}
