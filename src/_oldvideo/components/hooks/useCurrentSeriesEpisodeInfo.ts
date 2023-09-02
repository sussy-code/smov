import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useMeta } from "@/_oldvideo/state/logic/meta";
import { MWMediaType } from "@/backend/metadata/types/mw";

export function useCurrentSeriesEpisodeInfo(descriptor: string) {
  const meta = useMeta(descriptor);
  const { t } = useTranslation();

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
    meta?.meta.meta.type === MWMediaType.SERIES && meta?.episode
  );

  if (!isSeries) return { isSeries: false };

  const humanizedEpisodeId = t("videoPlayer.seasonAndEpisode", {
    season: currentSeasonInfo?.number,
    episode: currentEpisodeInfo?.number,
  });

  return {
    isSeries: true,
    humanizedEpisodeId,
    currentSeasonInfo,
    currentEpisodeInfo,
    meta: meta?.meta,
  };
}
