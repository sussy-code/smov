import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";
import React, {
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  initialPlayerState,
  PlayerContext,
  useVideoPlayer,
} from "./hooks/useVideoPlayer";

interface VideoPlayerContextType {
  source: string | null;
  sourceType: MWStreamType;
  quality: MWStreamQuality;
  state: PlayerContext;
}
const initial: VideoPlayerContextType = {
  source: null,
  sourceType: MWStreamType.MP4,
  quality: MWStreamQuality.QUNKNOWN,
  state: initialPlayerState,
};

type VideoPlayerContextAction =
  | {
      type: "SET_SOURCE";
      url: string;
      sourceType: MWStreamType;
      quality: MWStreamQuality;
    }
  | {
      type: "UPDATE_PLAYER";
      state: PlayerContext;
    };

function videoPlayerContextReducer(
  original: VideoPlayerContextType,
  action: VideoPlayerContextAction
): VideoPlayerContextType {
  const video = { ...original };
  if (action.type === "SET_SOURCE") {
    video.source = action.url;
    video.sourceType = action.sourceType;
    video.quality = action.quality;
    return video;
  }
  if (action.type === "UPDATE_PLAYER") {
    video.state = action.state;
    return video;
  }

  return original;
}

export const VideoPlayerContext =
  createContext<VideoPlayerContextType>(initial);
export const VideoPlayerDispatchContext = createContext<
  React.Dispatch<VideoPlayerContextAction>
>(null as any);

export function VideoPlayerContextProvider(props: {
  children: React.ReactNode;
  player: MutableRefObject<HTMLVideoElement | null>;
  wrapper: MutableRefObject<HTMLDivElement | null>;
}) {
  const { playerState } = useVideoPlayer(props.player, props.wrapper);
  const [videoData, dispatch] = useReducer<typeof videoPlayerContextReducer>(
    videoPlayerContextReducer,
    initial
  );

  useEffect(() => {
    dispatch({
      type: "UPDATE_PLAYER",
      state: playerState,
    });
  }, [playerState]);

  return (
    <VideoPlayerContext.Provider value={videoData}>
      <VideoPlayerDispatchContext.Provider value={dispatch}>
        {props.children}
      </VideoPlayerDispatchContext.Provider>
    </VideoPlayerContext.Provider>
  );
}

export function useVideoPlayerState() {
  const { state } = useContext(VideoPlayerContext);

  return {
    videoState: state,
  };
}
