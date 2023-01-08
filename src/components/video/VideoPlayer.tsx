import { forwardRef, useCallback, useContext, useEffect, useRef } from "react";
import {
  VideoPlayerContext,
  VideoPlayerContextProvider,
  VideoPlayerDispatchContext,
} from "./VideoContext";

interface VideoPlayerProps {
  children?: React.ReactNode;
}

const VideoPlayerInternals = forwardRef<HTMLVideoElement>((props, ref) => {
  const video = useContext(VideoPlayerContext);
  const dispatch = useContext(VideoPlayerDispatchContext);

  const onPlay = useCallback(() => {
    dispatch({
      type: "CONTROL",
      do: "PLAY",
      soft: true,
    });
  }, [dispatch]);
  const onPause = useCallback(() => {
    dispatch({
      type: "CONTROL",
      do: "PAUSE",
      soft: true,
    });
  }, [dispatch]);

  useEffect(() => {}, []);

  return (
    <video ref={ref} onPlay={onPlay} onPause={onPause} controls>
      {video.source ? <source src={video.source} type="video/mp4" /> : null}
    </video>
  );
});

export function VideoPlayer(props: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const playerWrapperRef = useRef<HTMLDivElement | null>(null);

  return (
    <VideoPlayerContextProvider
      player={playerRef}
      playerWrapper={playerWrapperRef}
    >
      <div ref={playerWrapperRef} className="bg-blue-900">
        <VideoPlayerInternals ref={playerRef} />
        {props.children}
      </div>
    </VideoPlayerContextProvider>
  );
}
