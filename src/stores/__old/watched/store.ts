import { useProgressStore } from "@/stores/progress";

import { OldData, migrateV2Videos } from "./migrations/v2";
import { migrateV3Videos } from "./migrations/v3";
import { migrateV4Videos } from "./migrations/v4";
import { WatchedStoreData } from "./types";
import { createVersionedStore } from "../migrations";

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
      useProgressStore.getState().replaceItems(migrateV4Videos(old));

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
