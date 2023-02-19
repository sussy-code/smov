import { createVersionedStore } from "@/utils/storage";
import { migrateV2Videos, OldData } from "./migrations/v2";
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
    create() {
      return {
        items: [],
      };
    },
  })
  .build();
