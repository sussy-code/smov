import { useTranslation } from "react-i18next";

import { Icons } from "@/components/Icon";
import { FloatingAnchor } from "@/components/popout/FloatingAnchor";
import { useIsMobile } from "@/hooks/useIsMobile";
import { VideoPlayerIconButton } from "@/video/components/parts/VideoPlayerIconButton";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useInterface } from "@/video/state/logic/interface";

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
        <FloatingAnchor id="settings">
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
        </FloatingAnchor>
      </div>
    </div>
  );
}
