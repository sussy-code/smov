import { useTranslation } from "react-i18next";

import { VideoPlayerIconButton } from "@/_oldvideo/components/parts/VideoPlayerIconButton";
import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { useControls } from "@/_oldvideo/state/logic/controls";
import { useInterface } from "@/_oldvideo/state/logic/interface";
import { useMeta } from "@/_oldvideo/state/logic/meta";
import { MWMediaType } from "@/backend/metadata/types/mw";
import { Icons } from "@/components/Icon";
import { FloatingAnchor } from "@/components/popout/FloatingAnchor";

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
        <FloatingAnchor id="episodes">
          <VideoPlayerIconButton
            active={videoInterface.popout === "episodes"}
            icon={Icons.EPISODES}
            text={t("videoPlayer.buttons.episodes") as string}
            wide
            onClick={() => controls.openPopout("episodes")}
          />
        </FloatingAnchor>
      </div>
    </div>
  );
}
