import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useEffect, useRef } from "react";

interface SourceControllerProps {
  source: string;
  type: MWStreamType;
  quality: MWStreamQuality;
}

export function SourceController(props: SourceControllerProps) {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const didInitialize = useRef<boolean>(false);

  useEffect(() => {
    if (didInitialize.current) return;
    controls.setSource(props);
    didInitialize.current = true;
  }, [props, controls]);

  return null;
}
