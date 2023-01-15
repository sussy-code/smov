import { useGoBack } from "@/hooks/useGoBack";
import { forwardRef, useContext, useEffect, useRef } from "react";
import { VideoErrorBoundary } from "./parts/VideoErrorBoundary";
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
  const goBack = useGoBack();

  // TODO move error boundary to only decorated, <VideoPlayer /> shouldn't have styling

  return (
    <VideoPlayerContextProvider player={playerRef} wrapper={playerWrapperRef}>
      <div
        className="relative h-full w-full select-none overflow-hidden bg-black"
        ref={playerWrapperRef}
      >
        <VideoErrorBoundary onGoBack={goBack}>
          <VideoPlayerInternals
            autoPlay={props.autoPlay ?? false}
            ref={playerRef}
          />
          <div className="absolute inset-0">{props.children}</div>
        </VideoErrorBoundary>
      </div>
    </VideoPlayerContextProvider>
  );
}
