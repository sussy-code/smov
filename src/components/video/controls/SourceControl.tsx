import { useContext, useEffect } from "react";
import { VideoPlayerDispatchContext } from "../VideoContext";

interface SourceControlProps {
  source: string;
  type: "m3u8" | "mp4";
}

export function SourceControl(props: SourceControlProps) {
  const dispatch = useContext(VideoPlayerDispatchContext);

  useEffect(() => {
    dispatch({
      type: "SET_SOURCE",
      url: props.source,
      sourceType: props.type,
    });
  }, [props, dispatch]);

  return null;
}
