import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { registerVideoPlayer, unregisterVideoPlayer } from "./init";

const VideoPlayerContext = createContext<string>("");

export function VideoPlayerContextProvider(props: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const vidId = registerVideoPlayer();
    setId(vidId);

    return () => {
      unregisterVideoPlayer(vidId);
    };
  }, [setId]);

  if (!id) return null;

  return (
    <VideoPlayerContext.Provider value={id}>
      {props.children}
    </VideoPlayerContext.Provider>
  );
}

export function useVideoPlayerDescriptor(): string {
  const id = useContext(VideoPlayerContext);
  return id;
}
