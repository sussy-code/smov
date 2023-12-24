import { useCallback, useMemo } from "react";

import { DetailedMeta } from "@/backend/metadata/getmeta";
import { MWMediaType } from "@/backend/metadata/types/mw";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import {
  PlayerMeta,
  metaToScrapeMedia,
  playerStatus,
} from "@/stores/player/slices/source";

export function usePlayerMeta() {
  const { meta, setMeta } = usePlayer();
  const scrapeMedia = useMemo(
    () => (meta ? metaToScrapeMedia(meta) : null),
    [meta],
  );

  const setDirectMeta = useCallback(
    (m: PlayerMeta) => {
      setMeta(m, playerStatus.SCRAPING);
    },
    [setMeta],
  );

  const setPlayerMeta = useCallback(
    (m: DetailedMeta, episodeId?: string) => {
      let playerMeta: PlayerMeta;
      if (m.meta.type === MWMediaType.SERIES) {
        const ep = m.meta.seasonData.episodes.find((v) => v.id === episodeId);
        if (!ep) return null;
        playerMeta = {
          type: "show",
          releaseYear: +(m.meta.year ?? 0),
          title: m.meta.title,
          poster: m.meta.poster,
          tmdbId: m.tmdbId ?? "",
          imdbId: m.imdbId,
          episodes: m.meta.seasonData.episodes.map((v) => ({
            number: v.number,
            title: v.title,
            tmdbId: v.id,
          })),
          episode: {
            number: ep.number,
            title: ep.title,
            tmdbId: ep.id,
          },
          season: {
            number: m.meta.seasonData.number,
            title: m.meta.seasonData.title,
            tmdbId: m.meta.seasonData.id,
          },
        };
      } else {
        playerMeta = {
          type: "movie",
          releaseYear: +(m.meta.year ?? 0),
          title: m.meta.title,
          poster: m.meta.poster,
          tmdbId: m.tmdbId ?? "",
          imdbId: m.imdbId,
        };
      }
      setDirectMeta(playerMeta);
      return playerMeta;
    },
    [setDirectMeta],
  );

  return {
    playerMeta: meta,
    setPlayerMeta,
    setDirectMeta,
    scrapeMedia,
  };
}
