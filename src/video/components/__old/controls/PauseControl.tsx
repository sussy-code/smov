import { Icons } from "@/components/Icon";
import { useCallback } from "react";
import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";
import { useVideoPlayerState } from "../VideoContext";

interface Props {
  className?: string;
  iconSize?: string;
}

export function PauseControl(props: Props) {
  const { videoState } = useVideoPlayerState();

  const handleClick = useCallback(() => {
    if (videoState?.isPlaying) videoState.pause();
    else videoState.play();
  }, [videoState]);

  const icon =
    videoState.isPlaying || videoState.isSeeking ? Icons.PAUSE : Icons.PLAY;

  return (
    <VideoPlayerIconButton
      iconSize={props.iconSize}
      className={props.className}
      icon={icon}
      onClick={handleClick}
    />
  );
}
