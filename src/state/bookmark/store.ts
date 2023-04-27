import { createVersionedStore } from "@/utils/storage";

import { BookmarkStoreData } from "./types";
import { OldBookmarks, migrateV1Bookmarks } from "../watched/migrations/v2";

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
    create() {
      return {
        bookmarks: [],
      };
    },
  })
  .build();
