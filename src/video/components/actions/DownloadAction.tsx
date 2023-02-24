import { Icons } from "@/components/Icon";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useSource } from "@/video/state/logic/source";
import { MWStreamType } from "@/backend/helpers/streams";
import { normalizeTitle } from "@/utils/normalizeTitle";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import { useMeta } from "@/video/state/logic/meta";
import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";

interface Props {
  className?: string;
}

export function DownloadAction(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const sourceInterface = useSource(descriptor);
  const { isMobile } = useIsMobile();
  const { t } = useTranslation();
  const meta = useMeta(descriptor);

  const isHLS = sourceInterface.source?.type === MWStreamType.HLS;

  const title = meta?.meta.meta.title;

  return (
    <a
      href={isHLS ? undefined : sourceInterface.source?.url}
      rel="noreferrer"
      target="_blank"
      download={title ? normalizeTitle(title) : undefined}
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
