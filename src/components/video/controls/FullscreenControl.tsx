import { Icons } from "@/components/Icon";
import { useCallback } from "react";
import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";
import { useVideoPlayerState } from "../VideoContext";

const canFullscreen = document.fullscreenEnabled;

interface Props {
  className?: string;
}

export function FullscreenControl(props: Props) {
  const { videoState } = useVideoPlayerState();

  const handleClick = useCallback(() => {
    if (videoState.isFullscreen) videoState.exitFullscreen();
    else videoState.enterFullscreen();
  }, [videoState]);

  if (!canFullscreen) return null;

  return (
    <VideoPlayerIconButton
      className={props.className}
      onClick={handleClick}
      icon={videoState.isFullscreen ? Icons.COMPRESS : Icons.EXPAND}
    />
  );
}
