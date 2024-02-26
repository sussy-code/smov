import { DetailedMeta, getMetaFromId } from "@/backend/metadata/getmeta";
import { searchForMedia } from "@/backend/metadata/search";
import { mediaItemTypeToMediaType } from "@/backend/metadata/tmdb";
import { MWMediaMeta, MWMediaType } from "@/backend/metadata/types/mw";
import { compareTitle } from "@/stores/__old/utils";

import { WatchedStoreData, WatchedStoreItem } from "../types";

interface OldMediaBase {
  mediaId: number;
  mediaType: MWMediaType;
  percentage: number;
  progress: number;
  providerId: string;
  title: string;
  year: number;
}

interface OldMovie extends OldMediaBase {
  mediaType: MWMediaType.MOVIE;
}

interface OldSeries extends OldMediaBase {
  mediaType: MWMediaType.SERIES;
  episodeId: number;
  seasonId: number;
}

export interface OldData {
  items: (OldMovie | OldSeries)[];
}

export interface OldBookmarks {
  bookmarks: (OldMovie | OldSeries)[];
}

async function getMetas(
  uniqueMedias: Record<string, any>,
  oldData?: OldData,
): Promise<Record<string, Record<string, DetailedMeta | null>> | undefined> {
  const yearsAreClose = (a: number, b: number) => {
    return Math.abs(a - b) <= 1;
  };

  const mediaMetas: Record<string, Record<string, DetailedMeta | null>> = {};

  const relevantItems = await Promise.all(
    Object.values(uniqueMedias).map(async (item) => {
      const year = Number(item.year.toString().split("-")[0]);
      const data = await searchForMedia({
        searchQuery: `${item.title} ${year}`,
      });
      const relevantItem = data.find(
        (res) =>
          yearsAreClose(Number(res.year), year) &&
          compareTitle(res.title, item.title),
      );
      if (!relevantItem) {
        console.error(`No item found for migration: ${item.title}`);
        return;
      }
      return {
        id: item.mediaId,
        data: relevantItem,
      };
    }),
  );

  for (const item of relevantItems.filter(Boolean)) {
    if (!item) continue;

    let keys: (string | null)[][] = [["0", "0"]];
    if (item.data.type === "show") {
      const meta = await getMetaFromId(MWMediaType.SERIES, item.data.id);
      if (!meta || !meta?.meta.seasons) return;
      const seasonNumbers = [
        ...new Set(
          oldData?.items
            ? oldData.items
                .filter((watchedEntry: any) => watchedEntry.mediaId === item.id)
                .map((watchedEntry: any) => watchedEntry.seasonId)
            : ["0"],
        ),
      ];
      const seasons = seasonNumbers.map((num) => ({
        num,
        season: meta.meta?.seasons?.[Math.max(0, (num as number) - 1)],
      }));
      keys = seasons
        .map((season) => (season ? [season.num, season?.season?.id] : []))
        .filter((entry) => entry.length > 0);
    }

    if (!mediaMetas[item.id]) mediaMetas[item.id] = {};
    await Promise.all(
      keys.map(async ([key, id]) => {
        if (!key) return;
        mediaMetas[item.id][key] = await getMetaFromId(
          mediaItemTypeToMediaType(item.data.type),
          item.data.id,
          id === "0" || id === null ? undefined : id,
        );
      }),
    );
  }

  return mediaMetas;
}

export async function migrateV1Bookmarks(old: OldBookmarks) {
  const oldData = old;
  if (!oldData) return;

  const uniqueMedias: Record<string, any> = {};
  oldData.bookmarks.forEach((item: any) => {
    if (uniqueMedias[item.mediaId]) return;
    uniqueMedias[item.mediaId] = item;
  });

  const mediaMetas = await getMetas(uniqueMedias);
  if (!mediaMetas) return;

  const bookmarks = Object.keys(mediaMetas)
    .map((key) => mediaMetas[key]["0"])
    .map((t) => t?.meta)
    .filter(Boolean);

  return {
    bookmarks,
  };
}

export async function migrateV2Videos(old: OldData) {
  const oldData = old;
  if (!oldData) return;

  const uniqueMedias: Record<string, any> = {};
  oldData.items.forEach((item: any) => {
    if (uniqueMedias[item.mediaId]) return;
    uniqueMedias[item.mediaId] = item;
  });

  const mediaMetas = await getMetas(uniqueMedias, oldData);
  if (!mediaMetas) return;

  // We've got all the metadata you can dream of now
  // Now let's convert stuff into the new format.
  const newData: WatchedStoreData = {
    ...oldData,
    items: [],
  };

  const now = Date.now();

  for (const oldWatched of oldData.items) {
    if (oldWatched.mediaType === "movie") {
      if (!mediaMetas[oldWatched.mediaId]["0"]?.meta) continue;

      const newItem: WatchedStoreItem = {
        item: {
          meta: mediaMetas[oldWatched.mediaId]["0"]?.meta as MWMediaMeta,
        },
        progress: oldWatched.progress,
        percentage: oldWatched.percentage,
        watchedAt: Date.now(), // There was no watchedAt in V2
      };

      oldData.items = oldData.items.filter(
        (item) => JSON.stringify(item) !== JSON.stringify(oldWatched),
      );
      newData.items.push(newItem);
    } else if (oldWatched.mediaType === "series") {
      if (!mediaMetas[oldWatched.mediaId][oldWatched.seasonId]?.meta) continue;

      const meta = mediaMetas[oldWatched.mediaId][oldWatched.seasonId]
        ?.meta as MWMediaMeta;

      if (meta.type !== "series") return;

      const newItem: WatchedStoreItem = {
        item: {
          meta,
          series: {
            episode: Number(oldWatched.episodeId),
            season: Number(oldWatched.seasonId),
            seasonId: meta.seasonData.id,
            episodeId:
              meta.seasonData.episodes[Number(oldWatched.episodeId) - 1].id,
          },
        },
        progress: oldWatched.progress,
        percentage: oldWatched.percentage,
        watchedAt:
          now +
          Number(oldWatched.seasonId) * 1000 +
          Number(oldWatched.episodeId), // There was no watchedAt in V2
        // JANK ALERT: Put watchedAt in the future to show last episode as most recently
      };

      if (
        newData.items.find(
          (item) =>
            item.item.meta.id === newItem.item.meta.id &&
            item.item.series?.episodeId === newItem.item.series?.episodeId,
        )
      )
        continue;

      oldData.items = oldData.items.filter(
        (item) => JSON.stringify(item) !== JSON.stringify(oldWatched),
      );
      newData.items.push(newItem);
    }
  }

  return newData;
}
