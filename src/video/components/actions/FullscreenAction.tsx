import { useCallback } from "react";

import { Icons } from "@/components/Icon";
import { canFullscreen } from "@/utils/detectFeatures";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useInterface } from "@/video/state/logic/interface";

import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";

interface Props {
  className?: string;
}

export function FullscreenAction(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const videoInterface = useInterface(descriptor);
  const controls = useControls(descriptor);

  const handleClick = useCallback(() => {
    if (videoInterface.isFullscreen) controls.exitFullscreen();
    else controls.enterFullscreen();
  }, [controls, videoInterface]);

  if (!canFullscreen()) return null;

  return (
    <VideoPlayerIconButton
      className={props.className}
      onClick={handleClick}
      icon={videoInterface.isFullscreen ? Icons.COMPRESS : Icons.EXPAND}
    />
  );
}
