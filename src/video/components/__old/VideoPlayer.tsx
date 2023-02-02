import { useGoBack } from "@/hooks/useGoBack";
import { useVolumeControl } from "@/hooks/useVolumeToggle";
import { forwardRef, useContext, useEffect, useRef } from "react";
import { VideoErrorBoundary } from "../../components/video/parts/VideoErrorBoundary";
import {
  useVideoPlayerState,
  VideoPlayerContext,
  VideoPlayerContextProvider,
} from "../../video/components./../components/video/VideoContext";

export interface VideoPlayerProps {
  autoPlay?: boolean;
  children?: React.ReactNode;
}

const VideoPlayerInternals = forwardRef<
  HTMLVideoElement,
  { autoPlay: boolean }
>((props, ref) => {
  const video = useContext(VideoPlayerContext);
  const didInitialize = useRef<{ source: string | null } | null>(null);
  const { videoState } = useVideoPlayerState();
  const { toggleVolume } = useVolumeControl();

  useEffect(() => {
    const value = { source: video.source };
    const hasChanged = value.source !== didInitialize.current?.source;
    if (!hasChanged) return;
    if (!video.state.hasInitialized || !video.source) return;
    video.state.initPlayer(video.source, video.sourceType);
    didInitialize.current = value;
  }, [didInitialize, video]);

  useEffect(() => {
    let isRolling = false;
    const onKeyDown = (evt: KeyboardEvent) => {
      if (!videoState.isFocused) return;
      if (!ref || !(ref as any)?.current) return;
      const el = (ref as any).current as HTMLVideoElement;

      switch (evt.key.toLowerCase()) {
        // Toggle fullscreen
        case "f":
          if (videoState.isFullscreen) {
            videoState.exitFullscreen();
          } else {
            videoState.enterFullscreen();
          }
          break;

        // Skip backwards
        case "arrowleft":
          videoState.setTime(videoState.time - 5);
          break;

        // Skip forward
        case "arrowright":
          videoState.setTime(videoState.time + 5);
          break;

        // Pause / play
        case " ":
          if (videoState.isPaused) {
            videoState.play();
          } else {
            videoState.pause();
          }
          break;

        // Mute
        case "m":
          toggleVolume();
          break;

        // Do a barrel Roll!
        case "r":
          if (isRolling) return;
          isRolling = true;
          el.classList.add("roll");
          setTimeout(() => {
            isRolling = false;
            el.classList.remove("roll");
          }, 1000);
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [videoState, toggleVolume, ref]);

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
        className="is-video-player relative h-full w-full select-none overflow-hidden bg-black [border-left:env(safe-area-inset-left)_solid_transparent] [border-right:env(safe-area-inset-right)_solid_transparent]"
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
