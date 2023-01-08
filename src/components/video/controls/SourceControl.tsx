import { useContext, useEffect } from "react";
import { VideoPlayerDispatchContext } from "../VideoContext";

interface SourceControlProps {
  source: string;
}

export function SourceControl(props: SourceControlProps) {
  const dispatch = useContext(VideoPlayerDispatchContext);

  useEffect(() => {
    dispatch({
      type: "SET_SOURCE",
      url: props.source,
    });
  }, [props.source, dispatch]);

  return null;
}
