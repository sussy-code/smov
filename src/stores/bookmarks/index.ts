import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { PlayerMeta } from "@/stores/player/slices/source";

export interface BookmarkMediaItem {
  title: string;
  year?: number;
  poster?: string;
  type: "show" | "movie";
  updatedAt: number;
}

export interface BookmarkStore {
  bookmarks: Record<string, BookmarkMediaItem>;
  addBookmark(meta: PlayerMeta): void;
  removeBookmark(id: string): void;
  replaceBookmarks(items: Record<string, BookmarkMediaItem>): void;
  clear(): void;
}

export const useBookmarkStore = create(
  persist(
    immer<BookmarkStore>((set) => ({
      bookmarks: {},
      removeBookmark(id) {
        set((s) => {
          delete s.bookmarks[id];
        });
      },
      addBookmark(meta) {
        set((s) => {
          s.bookmarks[meta.tmdbId] = {
            type: meta.type,
            title: meta.title,
            year: meta.releaseYear,
            poster: meta.poster,
            updatedAt: Date.now(),
          };
        });
      },
      replaceBookmarks(items: Record<string, BookmarkMediaItem>) {
        set((s) => {
          s.bookmarks = items;
        });
      },
      clear() {
        this.replaceBookmarks({});
      },
    })),
    {
      name: "__MW::bookmarks",
    }
  )
);
