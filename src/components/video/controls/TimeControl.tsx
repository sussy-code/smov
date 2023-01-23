import { Icons } from "@/components/Icon";
import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";
import { useVideoPlayerState } from "../VideoContext";

interface Props {
  className?: string;
}

export function TimeControl(props: Props) {
  const { videoState } = useVideoPlayerState();

  const skipForward = () => {
    videoState.setTime(videoState.time + 10);
  };

  const skipBackward = () => {
    videoState.setTime(videoState.time - 10);
  };

  return (
    <div className={props.className}>
      <p className="flex select-none items-center text-white">
        <VideoPlayerIconButton
          icon={Icons.SKIP_BACKWARD}
          onClick={skipBackward}
        />
        <VideoPlayerIconButton
          icon={Icons.SKIP_FORWARD}
          onClick={skipForward}
        />
      </p>
    </div>
  );
}
