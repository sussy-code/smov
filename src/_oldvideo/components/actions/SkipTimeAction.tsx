import { Icons } from "@/components/Icon";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useProgress } from "@/video/state/logic/progress";

import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";

interface Props {
  className?: string;
}

export function SkipTimeBackwardAction() {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const videoTime = useProgress(descriptor);

  const skipBackward = () => {
    controls.setTime(videoTime.time - 10);
  };

  return (
    <VideoPlayerIconButton icon={Icons.SKIP_BACKWARD} onClick={skipBackward} />
  );
}

export function SkipTimeForwardAction() {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const videoTime = useProgress(descriptor);

  const skipForward = () => {
    controls.setTime(videoTime.time + 10);
  };

  return (
    <VideoPlayerIconButton icon={Icons.SKIP_FORWARD} onClick={skipForward} />
  );
}

export function SkipTimeAction(props: Props) {
  return (
    <div className={props.className}>
      <div className="flex select-none items-center text-white">
        <SkipTimeBackwardAction />
        <SkipTimeForwardAction />
      </div>
    </div>
  );
}
