import { getLegacyMetaFromId } from "@/backend/metadata/getmeta";
import { getMovieFromExternalId } from "@/backend/metadata/tmdb";
import { MWMediaType } from "@/backend/metadata/types/mw";

import { WatchedStoreData } from "../types";

async function migrateId(
  id: number,
  type: MWMediaType
): Promise<string | undefined> {
  const meta = await getLegacyMetaFromId(type, id.toString());

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

export async function migrateV2Bookmarks(old: any) {
  const oldData = old;
  if (!oldData) return;

  const updatedBookmarks = oldData.bookmarks.map(
    async (item: { id: number; type: MWMediaType }) => ({
      ...item,
      id: await migrateId(item.id, item.type),
    })
  );

  return {
    bookmarks: (await Promise.all(updatedBookmarks)).filter((item) => item.id),
  };
}

export async function migrateV3Videos(old: any) {
  const oldData = old;
  if (!oldData) return;

  const updatedItems = await Promise.all(
    oldData.items.map(async (item: any) => {
      const migratedId = await migrateId(
        item.item.meta.id,
        item.item.meta.type
      );

      const migratedItem = {
        ...item,
        item: {
          ...item.item,
          meta: {
            ...item.item.meta,
            id: migratedId,
          },
        },
      };

      return {
        ...item,
        item: migratedId ? migratedItem : item.item,
      };
    })
  );

  const newData: WatchedStoreData = {
    items: updatedItems.map((item) => item.item),
  };

  return {
    ...oldData,
    items: newData.items,
  };
}
