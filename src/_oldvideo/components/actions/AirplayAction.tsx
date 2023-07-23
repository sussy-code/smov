import { useCallback } from "react";

import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { useControls } from "@/_oldvideo/state/logic/controls";
import { useMisc } from "@/_oldvideo/state/logic/misc";
import { Icons } from "@/components/Icon";

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
