import { versionedStoreBuilder } from "@/utils/storage";

export const VideoProgressStore = versionedStoreBuilder()
  .setKey("video-progress")
  .addVersion({
    version: 0,
  })
  .addVersion({
    version: 1,
    migrate() {
      // TODO add migration back
      return {
        items: [],
      };
    },
  })
  .addVersion({
    version: 2,
    migrate() {
      // TODO actually migrate
      return {
        items: [],
      };
    },
    create() {
      return {
        items: [],
      };
    },
  })
  .build();
