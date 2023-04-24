import { useCallback } from "react";

import { Icons } from "@/components/Icon";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";

import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";

interface Props {
  className?: string;
  iconSize?: string;
}

export function PauseAction(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const mediaPlaying = useMediaPlaying(descriptor);
  const controls = useControls(descriptor);

  const handleClick = useCallback(() => {
    if (mediaPlaying.isPlaying) controls.pause();
    else controls.play();
  }, [mediaPlaying, controls]);

  const icon =
    mediaPlaying.isPlaying || mediaPlaying.isSeeking ? Icons.PAUSE : Icons.PLAY;

  return (
    <VideoPlayerIconButton
      iconSize={props.iconSize}
      className={props.className}
      icon={icon}
      onClick={handleClick}
    />
  );
}
