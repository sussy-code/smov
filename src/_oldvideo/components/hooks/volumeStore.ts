import { createVersionedStore } from "@/utils/storage";

interface VolumeStoreData {
  volume: number;
}

export const volumeStore = createVersionedStore<VolumeStoreData>()
  .setKey("mw-volume")
  .addVersion({
    version: 0,
    create() {
      return {
        volume: 1,
      };
    },
  })
  .build();

export function getStoredVolume(): number {
  const store = volumeStore.get();
  return store.volume;
}

export function setStoredVolume(volume: number) {
  volumeStore.save({
    volume,
  });
}
