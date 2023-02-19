import { Icons } from "@/components/Icon";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { VideoPlayerIconButton } from "@/video/components/parts/VideoPlayerIconButton";
import { useControls } from "@/video/state/logic/controls";
import { PopoutAnchor } from "@/video/components/popouts/PopoutAnchor";
import { useInterface } from "@/video/state/logic/interface";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
}

export function SourceSelectionAction(props: Props) {
  const { t } = useTranslation();
  const descriptor = useVideoPlayerDescriptor();
  const videoInterface = useInterface(descriptor);
  const controls = useControls(descriptor);

  return (
    <div className={props.className}>
      <div className="relative">
        <PopoutAnchor for="source">
          <VideoPlayerIconButton
            active={videoInterface.popout === "source"}
            icon={Icons.CLAPPER_BOARD}
            iconSize="text-xl"
            text={t("videoPlayer.buttons.source") as string}
            wide
            onClick={() => controls.openPopout("source")}
          />
        </PopoutAnchor>
      </div>
    </div>
  );
}
