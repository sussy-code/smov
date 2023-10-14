import { ScrapeMedia } from "@movie-web/providers";

import { MakeSlice } from "@/stores/player/slices/types";
import {
  SourceQuality,
  SourceSliceSource,
  selectQuality,
} from "@/stores/player/utils/qualities";
import { ValuesOf } from "@/utils/typeguard";

export const playerStatus = {
  IDLE: "idle",
  SCRAPING: "scraping",
  PLAYING: "playing",
} as const;

export type PlayerStatus = ValuesOf<typeof playerStatus>;

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
  qualities: SourceQuality[];
  currentQuality: SourceQuality | null;
  meta: PlayerMeta | null;
  setStatus(status: PlayerStatus): void;
  setSource(stream: SourceSliceSource): void;
  switchQuality(quality: SourceQuality): void;
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

export const createSourceSlice: MakeSlice<SourceSlice> = (set, get) => ({
  source: null,
  qualities: [],
  currentQuality: null,
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
  setSource(stream: SourceSliceSource) {
    let qualities: string[] = [];
    if (stream.type === "file") qualities = Object.keys(stream.qualities);
    const store = get();
    const loadableStream = selectQuality(stream);

    set((s) => {
      s.source = stream;
      s.qualities = qualities as SourceQuality[];
      s.currentQuality = loadableStream.quality;
    });

    store.display?.load(loadableStream.stream);
  },
  switchQuality(quality) {
    const store = get();
    if (!store.source) return;
    if (store.source.type === "file") {
      const selectedQuality = store.source.qualities[quality];
      if (!selectedQuality) return;
      set((s) => {
        s.currentQuality = quality;
      });
      store.display?.load(selectedQuality);
    }
  },
});
