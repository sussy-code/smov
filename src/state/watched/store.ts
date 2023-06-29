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
    create() {
      return {
        items: [],
      };
    },
  })
  .build();
