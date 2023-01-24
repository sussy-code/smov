import { useCurrentSeriesEpisodeInfo } from "../hooks/useCurrentSeriesEpisodeInfo";

export function ShowTitleControl() {
  const { isSeries, currentEpisodeInfo, episodeIdentifier } =
    useCurrentSeriesEpisodeInfo();

  if (!isSeries) return null;

  return (
    <p className="ml-8 select-none space-x-2 text-white">
      <span>{episodeIdentifier}</span>
      <span className="opacity-50">{currentEpisodeInfo?.title}</span>
    </p>
  );
}
