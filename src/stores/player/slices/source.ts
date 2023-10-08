import { ScrapeMedia } from "@movie-web/providers";

import { MWStreamType } from "@/backend/helpers/streams";
import { MakeSlice } from "@/stores/player/slices/types";
import { ValuesOf } from "@/utils/typeguard";

export const playerStatus = {
  IDLE: "idle",
  SCRAPING: "scraping",
  PLAYING: "playing",
} as const;

export type PlayerStatus = ValuesOf<typeof playerStatus>;

export interface SourceSliceSource {
  url: string;
  type: MWStreamType;
}

export interface PlayerMeta {
  type: "movie" | "show";
  title: string;
  tmdbId: string;
  imdbId?: string;
  releaseYear: number;
  episode?: {
    number: number;
    tmdbId: string;
    title: string;
  };
  season?: {
    number: number;
    tmdbId: string;
    title: string;
  };
}

export interface SourceSlice {
  status: PlayerStatus;
  source: SourceSliceSource | null;
  meta: PlayerMeta | null;
  setStatus(status: PlayerStatus): void;
  setSource(url: string, type: MWStreamType): void;
  setMeta(meta: PlayerMeta): void;
}

export function metaToScrapeMedia(meta: PlayerMeta): ScrapeMedia {
  if (meta.type === "show") {
    if (!meta.episode || !meta.season) throw new Error("missing show data");
    return {
      title: meta.title,
      releaseYear: meta.releaseYear,
      tmdbId: meta.tmdbId,
      type: "show",
      imdbId: meta.imdbId,
      episode: meta.episode,
      season: meta.season,
    };
  }

  return {
    title: meta.title,
    releaseYear: meta.releaseYear,
    tmdbId: meta.tmdbId,
    type: "movie",
    imdbId: meta.imdbId,
  };
}

export const createSourceSlice: MakeSlice<SourceSlice> = (set) => ({
  source: null,
  status: playerStatus.IDLE,
  meta: null,
  setStatus(status: PlayerStatus) {
    set((s) => {
      s.status = status;
    });
  },
  setMeta(meta) {
    set((s) => {
      s.meta = meta;
    });
  },
  setSource(url: string, type: MWStreamType) {
    set((s) => {
      s.source = {
        type,
        url,
      };
    });
  },
});
