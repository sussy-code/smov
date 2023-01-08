import { forwardRef, useContext, useRef } from "react";
import { VideoPlayerContext, VideoPlayerContextProvider } from "./VideoContext";

export interface VideoPlayerProps {
  autoPlay?: boolean;
  children?: React.ReactNode;
}

const VideoPlayerInternals = forwardRef<
  HTMLVideoElement,
  { autoPlay: boolean }
>((props, ref) => {
  const video = useContext(VideoPlayerContext);

  return (
    <video
      ref={ref}
      autoPlay={props.autoPlay}
      playsInline
      className="h-full w-full"
    >
      {video.source ? <source src={video.source} type="video/mp4" /> : null}
    </video>
  );
});

export function VideoPlayer(props: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const playerWrapperRef = useRef<HTMLDivElement | null>(null);

  return (
    <VideoPlayerContextProvider player={playerRef} wrapper={playerWrapperRef}>
      <div
        className="relative aspect-video w-full bg-black"
        ref={playerWrapperRef}
      >
        <VideoPlayerInternals
          autoPlay={props.autoPlay ?? false}
          ref={playerRef}
        />
        <div className="absolute inset-0">{props.children}</div>
      </div>
    </VideoPlayerContextProvider>
  );
}
