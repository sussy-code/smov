import { MWMediaMeta, getProviderMetadata } from "providers";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { VideoProgressStore } from "./store";

interface WatchedStoreItem extends MWMediaMeta {
  progress: number;
  percentage: number;
}

interface WatchedStoreData {
  items: WatchedStoreItem[];
}

interface WatchedStoreDataWrapper {
  updateProgress(media: MWMediaMeta, progress: number, total: number): void;
  getFilteredWatched(): WatchedStoreItem[];
  watched: WatchedStoreData;
}

const WatchedContext = createContext<WatchedStoreDataWrapper>({
  updateProgress: () => {},
  getFilteredWatched: () => [],
  watched: {
    items: [],
  },
});
WatchedContext.displayName = "WatchedContext";

export function WatchedContextProvider(props: { children: ReactNode }) {
  const watchedLocalstorage = VideoProgressStore.get();
  const [watched, setWatchedReal] = useState<WatchedStoreData>(
    watchedLocalstorage as WatchedStoreData
  );

  function setWatched(data: any) {
    setWatchedReal((old) => {
      let newData = data;
      if (data.constructor === Function) {
        newData = data(old);
      }
      watchedLocalstorage.save(newData);
      return newData;
    });
  }

  const contextValue = {
    updateProgress(media: MWMediaMeta, progress: number, total: number): void {
      setWatched((data: WatchedStoreData) => {
        let item = getWatchedFromPortable(data.items, media);
        if (!item) {
          item = {
            mediaId: media.mediaId,
            mediaType: media.mediaType,
            providerId: media.providerId,
            title: media.title,
            year: media.year,
            percentage: 0,
            progress: 0,
            episode: media.episode,
            season: media.season,
          };
          data.items.push(item);
        }

        // update actual item
        item.progress = progress;
        item.percentage = Math.round((progress / total) * 100);

        return data;
      });
    },
    getFilteredWatched() {
      return watched.items.filter((item) => {
        return getProviderMetadata(item.providerId)?.enabled;
      });
    },
    watched,
  };

  return (
    <WatchedContext.Provider value={contextValue}>
      {props.children}
    </WatchedContext.Provider>
  );
}

export function useWatchedContext() {
  return useContext(WatchedContext);
}

export function getWatchedFromPortable(
  items: WatchedStoreItem[],
  media: MWMediaMeta
): WatchedStoreItem | undefined {
  return items.find((v) => {
    return (
      v.mediaId === media.mediaId &&
      v.providerId === media.providerId &&
      v.episode === media.episode &&
      v.season === media.season
    );
  });
}
