import { MWMediaMeta } from "@/backend/metadata/types";
import { Helmet } from "react-helmet";
import { useCurrentSeriesEpisodeInfo } from "../hooks/useCurrentSeriesEpisodeInfo";

interface PageTitleControlProps {
  media?: MWMediaMeta;
}

export function PageTitleControl(props: PageTitleControlProps) {
  const { isSeries, humanizedEpisodeId } = useCurrentSeriesEpisodeInfo();

  if (!props.media) return null;

  const title = isSeries
    ? `${props.media.title} - ${humanizedEpisodeId}`
    : props.media.title;

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}
