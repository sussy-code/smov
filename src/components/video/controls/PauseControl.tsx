import { useCallback, useContext } from "react";
import {
  VideoPlayerContext,
  VideoPlayerDispatchContext,
} from "../VideoContext";

export function PauseControl() {
  const dispatch = useContext(VideoPlayerDispatchContext);
  const video = useContext(VideoPlayerContext);

  const handleClick = useCallback(() => {
    if (video.controlState === "playing")
      dispatch({
        type: "CONTROL",
        do: "PAUSE",
      });
    else if (video.controlState === "paused")
      dispatch({
        type: "CONTROL",
        do: "PLAY",
      });
  }, [video, dispatch]);

  let text = "paused";
  if (video.controlState === "playing") text = "playing";

  return (
    <button type="button" onClick={handleClick}>
      {text}
    </button>
  );
}
