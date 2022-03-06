import { getProviderMetadata, MWMediaMeta } from "providers";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { BookmarkStore } from "./store";

interface BookmarkStoreData {
  bookmarks: MWMediaMeta[];
}

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
  const a = bookmarks.findIndex(
    (v) =>
      v.mediaId === media.mediaId &&
      v.providerId === media.providerId &&
      v.episode === media.episode &&
      v.season === media.season
  );
  return a;
}

export function BookmarkContextProvider(props: { children: ReactNode }) {
  const bookmarkLocalstorage = BookmarkStore.get();
  const [bookmarkStorage, setBookmarkStore] = useState<BookmarkStoreData>(
    bookmarkLocalstorage as BookmarkStoreData
  );

  const setBookmarked = useCallback(
    (data: any) => {
      setBookmarkStore((old) => {
        const old2 = JSON.parse(JSON.stringify(old));
        let newData = data;
        if (data.constructor === Function) {
          newData = data(old2);
        }
        bookmarkLocalstorage.save(newData);
        return newData;
      });
    },
    [bookmarkLocalstorage, setBookmarkStore]
  );

  const contextValue = useMemo(
    () => ({
      setItemBookmark(media: MWMediaMeta, bookmarked: boolean) {
        setBookmarked((data: BookmarkStoreData) => {
          if (bookmarked) {
            const itemIndex = getBookmarkIndexFromMedia(data.bookmarks, media);
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
            const itemIndex = getBookmarkIndexFromMedia(data.bookmarks, media);
            if (itemIndex !== -1) {
              data.bookmarks.splice(itemIndex);
            }
          }
          return data;
        });
      },
      getFilteredBookmarks() {
        return bookmarkStorage.bookmarks.filter(
          (bookmark) => getProviderMetadata(bookmark.providerId)?.enabled
        );
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
