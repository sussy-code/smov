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
  watched: WatchedStoreData;
}

const WatchedContext = createContext<WatchedStoreDataWrapper>({
  setWatched: () => {},
  watched: {
    items: [],
  },
});
WatchedContext.displayName = "WatchedContext";

export function WatchedContextProvider(props: { children: ReactNode }) {
  const watchedLocalstorage = VideoProgressStore.get();
  const [watched, setWatched] = useState<WatchedStoreData>(
    watchedLocalstorage as WatchedStoreData
  );
  const contextValue = {
    setWatched(data: any) {
      setWatched((old) => {
        let newData = data;
        if (data.constructor === Function) {
          newData = data(old);
        }
        watchedLocalstorage.save(newData);
        return newData;
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
