import { MWStreamType } from "@/backend/helpers/streams";
import { useContext, useEffect } from "react";
import { VideoPlayerDispatchContext } from "../VideoContext";

interface SourceControlProps {
  source: string;
  type: MWStreamType;
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
