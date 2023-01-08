import { useCallback } from "react";
import { useVideoPlayerState } from "../VideoContext";

export function PauseControl() {
  const { videoState } = useVideoPlayerState();

  const handleClick = useCallback(() => {
    if (videoState?.isPlaying) videoState.pause();
    else videoState.play();
  }, [videoState]);

  let text = "paused";
  if (videoState?.isPlaying) text = "playing";

  return (
    <button type="button" onClick={handleClick}>
      {text}
    </button>
  );
}
