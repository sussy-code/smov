import { Icons } from "@/components/Icon";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useSource } from "@/video/state/logic/source";
import { MWStreamType } from "@/backend/helpers/streams";
import { normalizeTitle } from "@/utils/normalizeTitle";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";

import { useCurrentSeriesEpisodeInfo } from "../hooks/useCurrentSeriesEpisodeInfo";
import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";

interface Props {
  className?: string;
}

export function DownloadAction(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const sourceInterface = useSource(descriptor);
  const { isSeries, humanizedEpisodeId, meta } =
    useCurrentSeriesEpisodeInfo(descriptor);
  const { isMobile } = useIsMobile();
  const { t } = useTranslation();

  /* if (!meta) return null;

  const title = isSeries
    ? `${meta?.meta.title} - ${humanizedEpisodeId}`
    : meta?.meta.title;
  */
  const isHLS = sourceInterface.source?.type === MWStreamType.HLS;

  return (
    <a
      href={isHLS ? undefined : sourceInterface.source?.url}
      rel="noreferrer"
      target="_blank"
      //    download={normalizeTitle(title)}
    >
      <VideoPlayerIconButton
        className={props.className}
        icon={Icons.DOWNLOAD}
        disabled={isHLS}
        text={isMobile ? (t("videoPlayer.buttons.download") as string) : ""}
      />
    </a>
  );
}
