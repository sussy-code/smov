import { Icons } from "@/components/Icon";
import { useCallback } from "react";
import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";
import { useVideoPlayerState } from "../VideoContext";

interface Props {
  className?: string;
}

export function AirplayControl(props: Props) {
  const { videoState } = useVideoPlayerState();

  const handleClick = useCallback(() => {
    videoState.startAirplay();
  }, [videoState]);

  if (!videoState.canAirplay) return null;

  return (
    <VideoPlayerIconButton
      className={props.className}
      onClick={handleClick}
      icon={Icons.AIRPLAY}
    />
  );
}
