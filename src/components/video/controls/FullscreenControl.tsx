import { useCallback, useContext } from "react";
import {
  VideoPlayerContext,
  VideoPlayerDispatchContext,
} from "../VideoContext";

export function FullscreenControl() {
  const dispatch = useContext(VideoPlayerDispatchContext);
  const video = useContext(VideoPlayerContext);

  const handleClick = useCallback(() => {
    dispatch({
      type: "FULLSCREEN",
      do: video.fullscreen ? "EXIT" : "ENTER",
    });
  }, [video, dispatch]);

  let text = "not fullscreen";
  if (video.fullscreen) text = "in fullscreen";

  return (
    <button type="button" onClick={handleClick}>
      {text}
    </button>
  );
}
