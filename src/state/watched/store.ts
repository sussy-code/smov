import { versionedStoreBuilder } from "@/utils/storage";

export const VideoProgressStore = versionedStoreBuilder()
  .setKey("video-progress-v3")
  .addVersion({
    version: 0,
  })
  .addVersion({
    version: 1,
    migrate() {
      return {
        items: [],
      };
    },
  })
  .addVersion({
    version: 2,
    migrate() {
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
