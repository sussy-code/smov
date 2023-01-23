import { useMemo } from "react";
import { useVideoPlayerState } from "../VideoContext";

export function ShowTitleControl() {
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

  if (!videoState.seasonData.isSeries) return null;
  if (!videoState.seasonData.current) return null;

  const selectedText = `S${currentSeasonInfo?.number} E${currentEpisodeInfo?.number}`;

  return (
    <p className="ml-8 select-none space-x-2 text-white">
      <span>{selectedText}</span>
      <span className="opacity-50">{currentEpisodeInfo?.title}</span>
    </p>
  );
}
