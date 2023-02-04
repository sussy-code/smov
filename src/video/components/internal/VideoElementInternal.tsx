import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";
import { setProvider, unsetStateProvider } from "@/video/state/providers/utils";
import { createVideoStateProvider } from "@/video/state/providers/videoStateProvider";
import { useEffect, useRef } from "react";

interface Props {
  autoPlay?: boolean;
}

export function VideoElementInternal(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const mediaPlaying = useMediaPlaying(descriptor);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const provider = createVideoStateProvider(descriptor, ref.current);
    setProvider(descriptor, provider);
    const { destroy } = provider.providerStart();
    return () => {
      unsetStateProvider(descriptor);
      destroy();
    };
  }, [descriptor]);

  // TODO shortcuts

  // this element is remotely controlled by a state provider
  return (
    <video
      ref={ref}
      autoPlay={props.autoPlay}
      muted={mediaPlaying.volume === 0}
      playsInline
      className="h-full w-full"
    />
  );
}
