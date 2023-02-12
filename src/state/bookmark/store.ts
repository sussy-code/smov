import { createVersionedStore } from "@/utils/storage";
import { migrateV1Bookmarks } from "../watched/migrations/v2";
import { BookmarkStoreData } from "./types";

export const BookmarkStore = createVersionedStore<BookmarkStoreData>()
  .setKey("mw-bookmarks")
  .addVersion({
    version: 0,
    migrate(oldBookmarks) {
      console.log(oldBookmarks);
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
