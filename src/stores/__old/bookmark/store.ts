import { MWMediaType } from "@/backend/metadata/types/mw";
import { BookmarkMediaItem, useBookmarkStore } from "@/stores/bookmarks";

import { BookmarkStoreData } from "./types";
import { createVersionedStore } from "../migrations";
import { OldBookmarks, migrateV1Bookmarks } from "../watched/migrations/v2";
import { migrateV2Bookmarks } from "../watched/migrations/v3";

const typeMap: Record<MWMediaType, "show" | "movie" | null> = {
  [MWMediaType.ANIME]: null,
  [MWMediaType.MOVIE]: "movie",
  [MWMediaType.SERIES]: "show",
};

export const BookmarkStore = createVersionedStore<BookmarkStoreData>()
  .setKey("mw-bookmarks")
  .addVersion({
    version: 0,
    migrate(oldBookmarks: OldBookmarks) {
      return migrateV1Bookmarks(oldBookmarks);
    },
  })
  .addVersion({
    version: 1,
    migrate(old: BookmarkStoreData) {
      return migrateV2Bookmarks(old);
    },
  })
  .addVersion({
    version: 2,
    migrate(old: BookmarkStoreData): BookmarkStoreData {
      const newItems: Record<string, BookmarkMediaItem> = {};

      for (const oldBookmark of old.bookmarks) {
        const type = typeMap[oldBookmark.type];
        if (!type) continue;
        newItems[oldBookmark.id] = {
          title: oldBookmark.title,
          year: oldBookmark.year ? Number(oldBookmark.year) : undefined,
          poster: oldBookmark.poster,
          type,
          updatedAt: Date.now(),
        };
      }

      useBookmarkStore.getState().replaceBookmarks(newItems);

      return { bookmarks: [] };
    },
  })
  .addVersion({
    version: 3,
    create() {
      return {
        bookmarks: [],
      };
    },
  })
  .build();
