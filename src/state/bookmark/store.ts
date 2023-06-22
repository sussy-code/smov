import { createVersionedStore } from "@/utils/storage";

import { BookmarkStoreData } from "./types";
import { OldBookmarks, migrateV1Bookmarks } from "../watched/migrations/v2";
import { migrateV2Bookmarks } from "../watched/migrations/v3";

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
    create() {
      return {
        bookmarks: [],
      };
    },
  })
  .build();
