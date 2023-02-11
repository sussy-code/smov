import { createVersionedStore } from "@/utils/storage";
import { BookmarkStoreData } from "./types";

export const BookmarkStore = createVersionedStore<BookmarkStoreData>()
  .setKey("mw-bookmarks")
  .addVersion({
    version: 0,
    migrate() {
      return {
        bookmarks: [], // TODO migrate bookmarks
      };
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
