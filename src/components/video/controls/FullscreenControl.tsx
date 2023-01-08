import { useCallback } from "react";
import { useVideoPlayerState } from "../VideoContext";

export function FullscreenControl() {
  const { videoState } = useVideoPlayerState();

  const handleClick = useCallback(() => {
    if (videoState.isFullscreen) videoState.exitFullscreen();
    else videoState.enterFullscreen();
  }, [videoState]);

  let text = "not fullscreen";
  if (videoState.isFullscreen) text = "in fullscreen";

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
