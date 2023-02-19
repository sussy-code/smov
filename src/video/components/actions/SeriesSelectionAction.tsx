import { Icons } from "@/components/Icon";
import { MWMediaType } from "@/backend/metadata/types";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMeta } from "@/video/state/logic/meta";
import { VideoPlayerIconButton } from "@/video/components/parts/VideoPlayerIconButton";
import { useControls } from "@/video/state/logic/controls";
import { PopoutAnchor } from "@/video/components/popouts/PopoutAnchor";
import { useInterface } from "@/video/state/logic/interface";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
}

export function SeriesSelectionAction(props: Props) {
  const { t } = useTranslation();
  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);
  const videoInterface = useInterface(descriptor);
  const controls = useControls(descriptor);

  if (meta?.meta.meta.type !== MWMediaType.SERIES) return null;

  return (
    <div className={props.className}>
      <div className="relative">
        <PopoutAnchor for="episodes">
          <VideoPlayerIconButton
            active={videoInterface.popout === "episodes"}
            icon={Icons.EPISODES}
            text={t("videoPlayer.buttons.episodes") as string}
            wide
            onClick={() => controls.openPopout("episodes")}
          />
        </PopoutAnchor>
      </div>
    </div>
  );
}
