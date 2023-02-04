import { versionedStoreBuilder } from "@/utils/storage";

export const volumeStore = versionedStoreBuilder()
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
  const store = volumeStore.get();
  store.save({
    volume,
  });
}
