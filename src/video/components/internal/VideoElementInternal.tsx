import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { setProvider, unsetStateProvider } from "@/video/state/providers/utils";
import { createVideoStateProvider } from "@/video/state/providers/videoStateProvider";
import { useEffect, useRef } from "react";

export function VideoElementInternal() {
  const descriptor = useVideoPlayerDescriptor();
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

  // TODO autoplay and muted
  return (
    <video
      ref={ref}
      playsInline
      className="h-full w-full"
      src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
    />
  );
}
