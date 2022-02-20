import { MWMediaStream, MWPortableMedia } from "providers";
import { useRef } from "react";

export interface VideoPlayerProps {
  source: MWMediaStream;
  onProgress?: (event: ProgressEvent) => void;
}

export function VideoPlayer(props: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mustUseHls = props.source.type === "m3u8";

  return (
    <video
      className="videoElement"
      ref={videoRef}
      onProgress={(e) =>
        props.onProgress && props.onProgress(e.nativeEvent as ProgressEvent)
      }
      controls
      autoPlay
    >
      {!mustUseHls ? <source src={props.source.url} type="video/mp4" /> : null}
    </video>
  );
}
