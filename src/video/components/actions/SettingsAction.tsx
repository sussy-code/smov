import { Icons } from "@/components/Icon";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { VideoPlayerIconButton } from "@/video/components/parts/VideoPlayerIconButton";
import { useControls } from "@/video/state/logic/controls";
import { PopoutAnchor } from "@/video/components/popouts/PopoutAnchor";
import { useInterface } from "@/video/state/logic/interface";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
}

export function SettingsAction(props: Props) {
  const { t } = useTranslation();
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const videoInterface = useInterface(descriptor);
  const { isMobile } = useIsMobile(false);

  return (
    <div className={props.className}>
      <div className="relative">
        <PopoutAnchor for="settings">
          <VideoPlayerIconButton
            active={videoInterface.popout === "settings"}
            className={props.className}
            onClick={() => controls.openPopout("settings")}
            text={
              isMobile
                ? (t("videoPlayer.buttons.settings") as string)
                : undefined
            }
            icon={Icons.GEAR}
          />
        </PopoutAnchor>
      </div>
    </div>
  );
}
