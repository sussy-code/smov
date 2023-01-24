import { useMemo } from "react";
import { useVideoPlayerState } from "../VideoContext";

export function useCurrentSeriesEpisodeInfo() {
  const { videoState } = useVideoPlayerState();

  const { current, seasons } = videoState.seasonData;

  const currentSeasonInfo = useMemo(() => {
    return seasons?.find((season) => season.id === current?.seasonId);
  }, [seasons, current]);

  const currentEpisodeInfo = useMemo(() => {
    return currentSeasonInfo?.episodes?.find(
      (episode) => episode.id === current?.episodeId
    );
  }, [currentSeasonInfo, current]);

  const isSeries = Boolean(
    videoState.seasonData.isSeries && videoState.seasonData.current
  );

  if (!isSeries) return { isSeries: false };

  const humanizedEpisodeId = `S${currentSeasonInfo?.number} E${currentEpisodeInfo?.number}`;

  return {
    isSeries: true,
    humanizedEpisodeId,
    currentSeasonInfo,
    currentEpisodeInfo,
  };
}
