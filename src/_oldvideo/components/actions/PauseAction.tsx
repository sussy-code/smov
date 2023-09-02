import { useCallback } from "react";

import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { useControls } from "@/_oldvideo/state/logic/controls";
import { useMediaPlaying } from "@/_oldvideo/state/logic/mediaplaying";
import { Icons } from "@/components/Icon";

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
