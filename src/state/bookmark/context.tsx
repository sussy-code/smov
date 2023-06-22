import { ReactNode, createContext, useContext, useMemo } from "react";

import { MWMediaMeta } from "@/backend/metadata/types/mw";
import { useStore } from "@/utils/storage";

import { BookmarkStore } from "./store";
import { BookmarkStoreData } from "./types";

interface BookmarkStoreDataWrapper {
  setItemBookmark(media: MWMediaMeta, bookedmarked: boolean): void;
  getFilteredBookmarks(): MWMediaMeta[];
  bookmarkStore: BookmarkStoreData;
}

const BookmarkedContext = createContext<BookmarkStoreDataWrapper>({
  setItemBookmark: () => {},
  getFilteredBookmarks: () => [],
  bookmarkStore: {
    bookmarks: [],
  },
});

function getBookmarkIndexFromMedia(
  bookmarks: MWMediaMeta[],
  media: MWMediaMeta
): number {
  const a = bookmarks.findIndex((v) => v.id === media.id);
  return a;
}

export function BookmarkContextProvider(props: { children: ReactNode }) {
  const [bookmarkStorage, setBookmarked] = useStore(BookmarkStore);

  const contextValue = useMemo(
    () => ({
      setItemBookmark(media: MWMediaMeta, bookmarked: boolean) {
        setBookmarked((data: BookmarkStoreData): BookmarkStoreData => {
          let bookmarks = [...data.bookmarks];
          bookmarks = bookmarks.filter((v) => v.id !== media.id);
          if (bookmarked) bookmarks.push({ ...media });
          return {
            bookmarks,
          };
        });
      },
      getFilteredBookmarks() {
        return [...bookmarkStorage.bookmarks];
      },
      bookmarkStore: bookmarkStorage,
    }),
    [bookmarkStorage, setBookmarked]
  );

  return (
    <BookmarkedContext.Provider value={contextValue}>
      {props.children}
    </BookmarkedContext.Provider>
  );
}

export function useBookmarkContext() {
  return useContext(BookmarkedContext);
}

export function getIfBookmarkedFromPortable(
  bookmarks: MWMediaMeta[],
  media: MWMediaMeta
): boolean {
  const bookmarked = getBookmarkIndexFromMedia(bookmarks, media);
  return bookmarked !== -1;
}
