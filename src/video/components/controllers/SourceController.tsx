import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";
import { useInitialized } from "@/video/components/hooks/useInitialized";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useEffect, useRef } from "react";

interface SourceControllerProps {
  source: string;
  type: MWStreamType;
  quality: MWStreamQuality;
  providerId?: string;
  embedId?: string;
}

export function SourceController(props: SourceControllerProps) {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const { initialized } = useInitialized(descriptor);
  const didInitialize = useRef<boolean>(false);

  useEffect(() => {
    if (didInitialize.current) return;
    if (!initialized) return;
    controls.setSource(props);
    didInitialize.current = true;
  }, [props, controls, initialized]);

  return null;
}
