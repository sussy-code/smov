import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { PlayerMeta } from "@/stores/player/slices/source";

export interface ProgressItem {
  watched: number;
  duration: number;
}

export interface ProgressSeasonItem {
  title: string;
  number: number;
  id: string;
}

export interface ProgressEpisodeItem {
  title: string;
  number: number;
  id: string;
  seasonId: string;
  progress: ProgressItem;
}

export interface ProgressMediaItem {
  title: string;
  year: number;
  poster?: string;
  type: "show" | "movie";
  progress?: ProgressItem;
  updatedAt: number;
  seasons: Record<string, ProgressSeasonItem>;
  episodes: Record<string, ProgressEpisodeItem>;
}

export interface UpdateItemOptions {
  meta: PlayerMeta;
  progress: ProgressItem;
}

export interface ProgressStore {
  items: Record<string, ProgressMediaItem>;
  updateItem(ops: UpdateItemOptions): void;
  removeItem(id: string): void;
}

// TODO add migration from previous progress store
export const useProgressStore = create(
  persist(
    immer<ProgressStore>((set) => ({
      items: {},
      removeItem(id) {
        set((s) => {
          delete s.items[id];
        });
      },
      updateItem({ meta, progress }) {
        set((s) => {
          if (!s.items[meta.tmdbId])
            s.items[meta.tmdbId] = {
              type: meta.type,
              episodes: {},
              seasons: {},
              updatedAt: 0,
              title: meta.title,
              year: meta.releaseYear,
              poster: meta.poster,
            };
          const item = s.items[meta.tmdbId];
          item.updatedAt = Date.now();

          if (meta.type === "movie") {
            if (!item.progress)
              item.progress = {
                duration: 0,
                watched: 0,
              };
            item.progress = { ...progress };
            return;
          }

          if (!meta.episode || !meta.season) return;

          if (!item.seasons[meta.season.tmdbId])
            item.seasons[meta.season.tmdbId] = {
              id: meta.season.tmdbId,
              number: meta.season.number,
              title: meta.season.title,
            };

          if (!item.episodes[meta.episode.tmdbId])
            item.episodes[meta.episode.tmdbId] = {
              id: meta.episode.tmdbId,
              number: meta.episode.number,
              title: meta.episode.title,
              seasonId: meta.season.tmdbId,
              progress: {
                duration: 0,
                watched: 0,
              },
            };

          item.episodes[meta.episode.tmdbId].progress = { ...progress };
        });
      },
    })),
    {
      name: "__MW::progress",
    }
  )
);
