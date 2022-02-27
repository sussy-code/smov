import { MWMediaMeta } from "providers";
import { createContext, ReactNode, useContext, useState } from "react";
import { BookmarkStore } from "./store";

interface BookmarkStoreData {
  bookmarks: MWMediaMeta[];
}

interface BookmarkStoreDataWrapper {
  setItemBookmark(media: MWMediaMeta, bookedmarked: boolean): void;
  bookmarkStore: BookmarkStoreData;
}

const BookmarkedContext = createContext<BookmarkStoreDataWrapper>({
  setItemBookmark: () => {},
  bookmarkStore: {
    bookmarks: [],
  },
});

export function BookmarkContextProvider(props: { children: ReactNode }) {
  const bookmarkLocalstorage = BookmarkStore.get();
  const [bookmarkStorage, setBookmarkStore] = useState<BookmarkStoreData>(
    bookmarkLocalstorage as BookmarkStoreData
  );

  function setBookmarked(data: any) {
    setBookmarkStore((old) => {
      let old2 = JSON.parse(JSON.stringify(old));
      let newData = data;
      if (data.constructor === Function) {
        newData = data(old2);
      }
      bookmarkLocalstorage.save(newData);
      return newData;
    });
  }

  const contextValue = {
    setItemBookmark(media: MWMediaMeta, bookmarked: boolean) {
      setBookmarked((data: BookmarkStoreData) => {
        if (bookmarked) {
          const itemIndex = getBookmarkIndexFromPortable(data, media);
          if (itemIndex === -1) {
            const item = {
              mediaId: media.mediaId,
              mediaType: media.mediaType,
              providerId: media.providerId,
              title: media.title,
              year: media.year,
              episode: media.episode,
              season: media.season,
            };
            data.bookmarks.push(item);
          }
        } else {
          const itemIndex = getBookmarkIndexFromPortable(data, media);
          if (itemIndex !== -1) {
            data.bookmarks.splice(itemIndex);
          }
        }
        return data;
      });
    },
    bookmarkStore: bookmarkStorage,
  };

  return (
    <BookmarkedContext.Provider value={contextValue}>
      {props.children}
    </BookmarkedContext.Provider>
  );
}

export function useBookmarkContext() {
  return useContext(BookmarkedContext);
}

function getBookmarkIndexFromPortable(
  store: BookmarkStoreData,
  media: MWMediaMeta
): number {
  const a = store.bookmarks.findIndex((v) => {
    return (
      v.mediaId === media.mediaId &&
      v.providerId === media.providerId &&
      v.episode === media.episode &&
      v.season === media.season
    );
  });
  return a;
}

export function getIfBookmarkedFromPortable(
  store: BookmarkStoreData,
  media: MWMediaMeta
): boolean {
  const bookmarked = getBookmarkIndexFromPortable(store, media);
  return bookmarked !== -1;
}
