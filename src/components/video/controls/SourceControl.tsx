import { MWStreamType } from "@/backend/helpers/streams";
import { useContext, useEffect, useRef } from "react";
import { VideoPlayerDispatchContext } from "../VideoContext";

interface SourceControlProps {
  source: string;
  type: MWStreamType;
}

export function SourceControl(props: SourceControlProps) {
  const dispatch = useContext(VideoPlayerDispatchContext);
  const didInitialize = useRef(false);

  useEffect(() => {
    if (didInitialize.current) return;
    dispatch({
      type: "SET_SOURCE",
      url: props.source,
      sourceType: props.type,
    });
    didInitialize.current = true;
  }, [props, dispatch]);

  return null;
}
