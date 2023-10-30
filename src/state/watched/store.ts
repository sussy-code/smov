import { MWMediaType } from "@/backend/metadata/types/mw";
import { ProgressMediaItem, useProgressStore } from "@/stores/progress";
import { createVersionedStore } from "@/utils/storage";

import { OldData, migrateV2Videos } from "./migrations/v2";
import { migrateV3Videos } from "./migrations/v3";
import { WatchedStoreData } from "./types";

export const VideoProgressStore = createVersionedStore<WatchedStoreData>()
  .setKey("video-progress")
  .addVersion({
    version: 0,
    migrate() {
      return {
        items: [], // dont migrate from version 0 to version 1, unmigratable
      };
    },
  })
  .addVersion({
    version: 1,
    async migrate(old: OldData) {
      return migrateV2Videos(old);
    },
  })
  .addVersion({
    version: 2,
    migrate(old: WatchedStoreData) {
      return migrateV3Videos(old);
    },
  })
  .addVersion({
    version: 3,
    migrate(old: WatchedStoreData): WatchedStoreData {
      console.log(old);

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
            !newItems[oldItem.item.meta.id].episodes[
              oldItem.item.series.episodeId
            ]
          ) {
            // Find episode ID (barely ever works)
            const episodeTitle = oldItem.item.meta.seasonData.episodes.find(
              (ep) => ep.id === oldItem.item.series?.episodeId
            )?.title;

            // Add season to season data
            newItems[oldItem.item.meta.id].seasons[
              oldItem.item.series.seasonId
            ] = {
              id: oldItem.item.series.seasonId,
              number: oldItem.item.series.season,
              title:
                oldItem.item.meta.seasons.find(
                  (s) => s.number === oldItem.item.series?.season
                )?.title || "Unknown season",
            };

            // Populate episode data
            newItems[oldItem.item.meta.id].episodes[
              oldItem.item.series.episodeId
            ] = {
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

      console.log(newItems);
      useProgressStore.getState().replaceItems(newItems);

      return {
        items: [],
      };
    },
  })
  .addVersion({
    version: 4,
    create() {
      return {
        items: [],
      };
    },
  })
  .build();
