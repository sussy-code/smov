import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { PlayerMeta } from "@/stores/player/slices/source";

export interface BookmarkMediaItem {
  title: string;
  year: number;
  poster?: string;
  type: "show" | "movie";
  updatedAt: number;
}

export interface ProgressStore {
  bookmarks: Record<string, BookmarkMediaItem>;
  addBookmark(meta: PlayerMeta): void;
  removeBookmark(id: string): void;
}

// TODO add migration from previous bookmark store
export const useBookmarkStore = create(
  persist(
    immer<ProgressStore>((set) => ({
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
    })),
    {
      name: "__MW::bookmarks",
    }
  )
);
