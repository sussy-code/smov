import { useVolumeStore } from "@/stores/volume";

import { createVersionedStore } from "../migrations";

interface VolumeStoreData {
  volume: number;
}

export const volumeStore = createVersionedStore<Record<never, never>>()
  .setKey("mw-volume")
  .addVersion({
    version: 0,
    create() {
      return {
        volume: 1,
      };
    },
    migrate(data: VolumeStoreData): Record<never, never> {
      useVolumeStore.getState().setVolume(data.volume);
      return {};
    },
  })
  .addVersion({
    version: 1,
    create() {
      return {};
    },
  })
  .build();
