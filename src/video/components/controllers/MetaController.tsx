import { MWMediaMeta } from "@/backend/metadata/types";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useEffect } from "react";

interface MetaControllerProps {
  meta?: MWMediaMeta;
}

export function MetaController(props: MetaControllerProps) {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);

  useEffect(() => {
    controls.setMeta(props.meta);
  }, [props, controls]);

  return null;
}
