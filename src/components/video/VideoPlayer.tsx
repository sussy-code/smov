import { forwardRef, useContext, useRef } from "react";
import { VideoPlayerContext, VideoPlayerContextProvider } from "./VideoContext";

interface VideoPlayerProps {
  children?: React.ReactNode;
}

const VideoPlayerInternals = forwardRef<HTMLVideoElement>((_, ref) => {
  const video = useContext(VideoPlayerContext);

  return (
    <video controls ref={ref}>
      {video.source ? <source src={video.source} type="video/mp4" /> : null}
    </video>
  );
});

export function VideoPlayer(props: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement | null>(null);

  return (
    <VideoPlayerContextProvider player={playerRef}>
      <VideoPlayerInternals ref={playerRef} />
      {props.children}
    </VideoPlayerContextProvider>
  );
}
