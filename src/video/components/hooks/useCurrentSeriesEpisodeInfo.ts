import { MWMediaType } from "@/backend/metadata/types";
import { useMeta } from "@/video/state/logic/meta";
import { useMemo } from "react";

export function useCurrentSeriesEpisodeInfo(descriptor: string) {
  const meta = useMeta(descriptor);

  const currentSeasonInfo = useMemo(() => {
    return meta?.seasons?.find(
      (season) => season.id === meta?.episode?.seasonId
    );
  }, [meta]);

  const currentEpisodeInfo = useMemo(() => {
    return currentSeasonInfo?.episodes?.find(
      (episode) => episode.id === meta?.episode?.episodeId
    );
  }, [currentSeasonInfo, meta]);

  const isSeries = Boolean(
    meta?.meta?.type === MWMediaType.SERIES && meta?.episode
  );

  if (!isSeries) return { isSeries: false };

  const humanizedEpisodeId = `S${currentSeasonInfo?.number} E${currentEpisodeInfo?.number}`;

  return {
    isSeries: true,
    humanizedEpisodeId,
    currentSeasonInfo,
    currentEpisodeInfo,
    meta: meta?.meta,
  };
}
