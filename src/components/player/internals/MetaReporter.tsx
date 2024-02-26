import { useEffect } from "react";

import { usePlayerStore } from "@/stores/player/store";

export type WindowMeta = {
  meta: {
    type: "show" | "movie";
    tmdbId: string;
    title: string;
    year: number;
    poster?: string;
  };
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
  progress: {
    time: number;
    duration: number;
  };
  controls: {
    isPlaying: boolean;
    isLoading: boolean;
  };
};

declare global {
  interface Window {
    meta?: {
      player?: WindowMeta;
    };
  }
}

/**
 * MetaReporter occasionally reports the progress to the window object at a specific spot
 * This is used by the PreMid presence to get currently playing data
 */
export function MetaReporter() {
  const meta = usePlayerStore((s) => s.meta);
  const progress = usePlayerStore((s) => s.progress);
  const mediaPlaying = usePlayerStore((s) => s.mediaPlaying);

  useEffect(() => {
    if (!window.meta) window.meta = {};
    if (meta) {
      window.meta.player = {
        meta: {
          title: meta.title,
          type: meta.type,
          tmdbId: meta.tmdbId,
          year: meta.releaseYear,
          poster: meta.poster,
        },
        controls: {
          isPlaying: mediaPlaying.isPlaying,
          isLoading: mediaPlaying.isLoading,
        },
        season: meta.season
          ? {
              number: meta.season.number,
              tmdbId: meta.season.tmdbId,
              title: meta.season.title,
            }
          : undefined,
        episode: meta.episode
          ? {
              number: meta.episode.number,
              tmdbId: meta.episode.tmdbId,
              title: meta.episode.title,
            }
          : undefined,
        progress: {
          time: progress.time,
          duration: progress.duration,
        },
      };
    }

    return () => {
      if (window.meta) delete window.meta.player;
    };
  }, [meta, progress, mediaPlaying]);

  return null;
}
