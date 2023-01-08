import { useCallback } from "react";
import { useVideoPlayerState } from "../VideoContext";

export function PauseControl() {
  const { videoState } = useVideoPlayerState();

  const handleClick = useCallback(() => {
    if (videoState?.isPlaying) videoState.pause();
    else videoState.play();
  }, [videoState]);

  let text =
    videoState.isPlaying || videoState.isSeeking ? "playing" : "paused";

  return (
    <button
      className="m-1 rounded bg-denim-100 p-1 text-white hover:opacity-75"
      type="button"
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
