import { useTranslation } from "react-i18next";

import { VideoPlayerIconButton } from "@/_oldvideo/components/parts/VideoPlayerIconButton";
import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { useControls } from "@/_oldvideo/state/logic/controls";
import { useInterface } from "@/_oldvideo/state/logic/interface";
import { Icons } from "@/components/Icon";
import { FloatingAnchor } from "@/components/popout/FloatingAnchor";
import { useIsMobile } from "@/hooks/useIsMobile";

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
