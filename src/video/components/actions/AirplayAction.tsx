import { useCallback } from "react";

import { Icons } from "@/components/Icon";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useMisc } from "@/video/state/logic/misc";

import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";

interface Props {
  className?: string;
}

export function AirplayAction(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const misc = useMisc(descriptor);

  const handleClick = useCallback(() => {
    controls.startAirplay();
  }, [controls]);

  if (!misc.canAirplay) return null;

  return (
    <VideoPlayerIconButton
      className={props.className}
      onClick={handleClick}
      icon={Icons.AIRPLAY}
    />
  );
}
