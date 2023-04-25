import { Helmet } from "react-helmet";

import { useVideoPlayerDescriptor } from "@/video/state/hooks";

import { useCurrentSeriesEpisodeInfo } from "../hooks/useCurrentSeriesEpisodeInfo";

export function PageTitleAction() {
  const descriptor = useVideoPlayerDescriptor();
  const { isSeries, humanizedEpisodeId, meta } =
    useCurrentSeriesEpisodeInfo(descriptor);

  if (!meta) return null;

  const title = isSeries
    ? `${meta.meta.title} - ${humanizedEpisodeId}`
    : meta.meta.title;

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}
