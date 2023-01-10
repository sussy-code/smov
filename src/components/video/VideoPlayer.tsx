import { forwardRef, useContext, useEffect, useRef } from "react";
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
  const didInitialize = useRef<true | null>(null);

  useEffect(() => {
    if (didInitialize.current) return;
    if (!video.state.hasInitialized || !video.source) return;
    video.state.initPlayer(video.source, video.sourceType);
    didInitialize.current = true;
  }, [didInitialize, video]);

  // muted attribute is required for safari, as they cant change the volume itself
  return (
    <video
      ref={ref}
      autoPlay={props.autoPlay}
      muted={video.state.volume === 0}
      playsInline
      className="h-full w-full"
    />
  );
});

export function VideoPlayer(props: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const playerWrapperRef = useRef<HTMLDivElement | null>(null);

  return (
    <VideoPlayerContextProvider player={playerRef} wrapper={playerWrapperRef}>
      <div
        className="relative aspect-video w-full select-none overflow-hidden bg-black"
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
