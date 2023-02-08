import { Icons } from "@/components/Icon";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { VideoPlayerIconButton } from "@/video/components/parts/VideoPlayerIconButton";
import { useControls } from "@/video/state/logic/controls";
import { PopoutAnchor } from "@/video/components/popouts/PopoutAnchor";

interface Props {
  className?: string;
}

export function CaptionsSelectionAction(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);

  return (
    <div className={props.className}>
      <div className="relative">
        <PopoutAnchor for="captions">
          <VideoPlayerIconButton
            className={props.className}
            onClick={() => controls.openPopout("captions")}
            icon={Icons.CAPTIONS}
          />
        </PopoutAnchor>
      </div>
    </div>
  );
}
