import { MWPortableMedia } from "providers";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { VideoProgressStore } from "./store";

interface WatchedStoreItem extends MWPortableMedia {
  progress: number;
  percentage: number;
}

interface WatchedStoreData {
  items: WatchedStoreItem[];
}

interface WatchedStoreDataWrapper {
  setWatched: React.Dispatch<React.SetStateAction<WatchedStoreData>>;
  updateProgress(media: MWPortableMedia, progress: number, total: number): void;
  watched: WatchedStoreData;
}

const WatchedContext = createContext<WatchedStoreDataWrapper>({
  setWatched: () => {},
  updateProgress: () => {},
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
    setWatched(data: any) {
      return setWatched(data);
    },
    updateProgress(
      media: MWPortableMedia,
      progress: number,
      total: number
    ): void {
      setWatched((data: WatchedStoreData) => {
        let item = getWatchedFromPortable(data, media);
        if (!item) {
          item = {
            mediaId: media.mediaId,
            mediaType: media.mediaType,
            providerId: media.providerId,
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
  store: WatchedStoreData,
  media: MWPortableMedia
): WatchedStoreItem | undefined {
  return store.items.find((v) => {
    return (
      v.mediaId === media.mediaId &&
      v.providerId === media.providerId &&
      v.episode === media.episode &&
      v.season === media.season
    );
  });
}
