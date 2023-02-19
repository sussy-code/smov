import { Icons } from "@/components/Icon";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { VideoPlayerIconButton } from "@/video/components/parts/VideoPlayerIconButton";
import { useControls } from "@/video/state/logic/controls";
import { PopoutAnchor } from "@/video/components/popouts/PopoutAnchor";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
}

export function CaptionsSelectionAction(props: Props) {
  const { t } = useTranslation();
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const { isMobile } = useIsMobile();

  return (
    <div className={props.className}>
      <div className="relative">
        <PopoutAnchor for="captions">
          <VideoPlayerIconButton
            className={props.className}
            text={isMobile ? (t("videoPlayer.buttons.captions") as string) : ""}
            wide={isMobile}
            onClick={() => controls.openPopout("captions")}
            icon={Icons.CAPTIONS}
          />
        </PopoutAnchor>
      </div>
    </div>
  );
}
