import { useVideoPlayerDescriptor } from "@/video/state/hooks";

import { useCurrentSeriesEpisodeInfo } from "../hooks/useCurrentSeriesEpisodeInfo";

export function ShowTitleAction() {
  const descriptor = useVideoPlayerDescriptor();
  const { isSeries, currentEpisodeInfo, humanizedEpisodeId } =
    useCurrentSeriesEpisodeInfo(descriptor);

  if (!isSeries) return null;

  return (
    <p className="ml-8 select-none space-x-2 text-white">
      <span>{humanizedEpisodeId}</span>
      <span className="opacity-50">{currentEpisodeInfo?.title}</span>
    </p>
  );
}
