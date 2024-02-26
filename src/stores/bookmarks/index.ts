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

export interface BookmarkUpdateItem {
  tmdbId: string;
  title?: string;
  year?: number;
  id: string;
  poster?: string;
  type?: "show" | "movie";
  action: "delete" | "add";
}

export interface BookmarkStore {
  bookmarks: Record<string, BookmarkMediaItem>;
  updateQueue: BookmarkUpdateItem[];
  addBookmark(meta: PlayerMeta): void;
  removeBookmark(id: string): void;
  replaceBookmarks(items: Record<string, BookmarkMediaItem>): void;
  clear(): void;
  clearUpdateQueue(): void;
  removeUpdateItem(id: string): void;
}

let updateId = 0;

export const useBookmarkStore = create(
  persist(
    immer<BookmarkStore>((set) => ({
      bookmarks: {},
      updateQueue: [],
      removeBookmark(id) {
        set((s) => {
          updateId += 1;
          s.updateQueue.push({
            id: updateId.toString(),
            action: "delete",
            tmdbId: id,
          });

          delete s.bookmarks[id];
        });
      },
      addBookmark(meta) {
        set((s) => {
          updateId += 1;
          s.updateQueue.push({
            id: updateId.toString(),
            action: "add",
            tmdbId: meta.tmdbId,
            type: meta.type,
            title: meta.title,
            year: meta.releaseYear,
            poster: meta.poster,
          });

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
        set((s) => {
          s.bookmarks = {};
        });
      },
      clearUpdateQueue() {
        set((s) => {
          s.updateQueue = [];
        });
      },
      removeUpdateItem(id: string) {
        set((s) => {
          s.updateQueue = [...s.updateQueue.filter((v) => v.id !== id)];
        });
      },
    })),
    {
      name: "__MW::bookmarks",
    },
  ),
);
