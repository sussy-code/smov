import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";
import { useContext, useEffect, useRef } from "react";
import { VideoPlayerDispatchContext } from "../VideoContext";

interface SourceControlProps {
  source: string;
  type: MWStreamType;
  quality: MWStreamQuality;
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
      quality: props.quality,
    });
    didInitialize.current = true;
  }, [props, dispatch]);

  return null;
}
