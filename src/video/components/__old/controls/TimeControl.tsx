import { Icons } from "@/components/Icon";
import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";
import { useVideoPlayerState } from "../VideoContext";

interface Props {
  className?: string;
}

export function SkipTimeBackward() {
  const { videoState } = useVideoPlayerState();

  const skipBackward = () => {
    videoState.setTime(videoState.time - 10);
  };

  return (
    <VideoPlayerIconButton icon={Icons.SKIP_BACKWARD} onClick={skipBackward} />
  );
}

export function SkipTimeForward() {
  const { videoState } = useVideoPlayerState();

  const skipForward = () => {
    videoState.setTime(videoState.time + 10);
  };

  return (
    <VideoPlayerIconButton icon={Icons.SKIP_FORWARD} onClick={skipForward} />
  );
}

export function TimeControl(props: Props) {
  return (
    <div className={props.className}>
      <div className="flex select-none items-center text-white">
        <SkipTimeBackward />
        <SkipTimeForward />
      </div>
    </div>
  );
}
