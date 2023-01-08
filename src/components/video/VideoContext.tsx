import React, {
  createContext,
  MutableRefObject,
  useEffect,
  useReducer,
} from "react";

interface VideoPlayerContextType {
  source: null | string;
  playerWrapper: HTMLDivElement | null;
  player: HTMLVideoElement | null;
  controlState: "paused" | "playing";
  fullscreen: boolean;
}
const initial = (
  player: HTMLVideoElement | null = null,
  wrapper: HTMLDivElement | null = null
): VideoPlayerContextType => ({
  source: null,
  playerWrapper: wrapper,
  player,
  controlState: "paused",
  fullscreen: false,
});

type VideoPlayerContextAction =
  | { type: "SET_SOURCE"; url: string }
  | { type: "CONTROL"; do: "PAUSE" | "PLAY"; soft?: boolean }
  | { type: "FULLSCREEN"; do: "ENTER" | "EXIT"; soft?: boolean }
  | {
      type: "UPDATE_PLAYER";
      player: HTMLVideoElement | null;
      playerWrapper: HTMLDivElement | null;
    };

function videoPlayerContextReducer(
  original: VideoPlayerContextType,
  action: VideoPlayerContextAction
): VideoPlayerContextType {
  const video = { ...original };
  if (action.type === "SET_SOURCE") {
    video.source = action.url;
    return video;
  }
  if (action.type === "CONTROL") {
    if (action.do === "PAUSE") video.controlState = "paused";
    else if (action.do === "PLAY") video.controlState = "playing";
    if (action.soft) return video;

    if (action.do === "PAUSE") video.player?.pause();
    else if (action.do === "PLAY") video.player?.play();
    return video;
  }
  if (action.type === "UPDATE_PLAYER") {
    video.player = action.player;
    video.playerWrapper = action.playerWrapper;
    return video;
  }
  if (action.type === "FULLSCREEN") {
    video.fullscreen = action.do === "ENTER";
    if (action.soft) return video;

    if (action.do === "ENTER") video.playerWrapper?.requestFullscreen();
    else document.exitFullscreen();
    return video;
  }

  return original;
}

export const VideoPlayerContext = createContext<VideoPlayerContextType>(
  initial()
);
export const VideoPlayerDispatchContext = createContext<
  React.Dispatch<VideoPlayerContextAction>
>(null as any);

export function VideoPlayerContextProvider(props: {
  children: React.ReactNode;
  player: MutableRefObject<HTMLVideoElement | null>;
  playerWrapper: MutableRefObject<HTMLDivElement | null>;
}) {
  const [videoData, dispatch] = useReducer<typeof videoPlayerContextReducer>(
    videoPlayerContextReducer,
    initial()
  );

  useEffect(() => {
    dispatch({
      type: "UPDATE_PLAYER",
      player: props.player.current,
      playerWrapper: props.playerWrapper.current,
    });
  }, [props.player, props.playerWrapper]);

  return (
    <VideoPlayerContext.Provider value={videoData}>
      <VideoPlayerDispatchContext.Provider value={dispatch}>
        {props.children}
      </VideoPlayerDispatchContext.Provider>
    </VideoPlayerContext.Provider>
  );
}
