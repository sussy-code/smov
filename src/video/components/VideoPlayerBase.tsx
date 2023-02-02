import { VideoPlayerContextProvider } from "../state/hooks";

export interface VideoPlayerProps {
  children?: React.ReactNode;
}

export function VideoPlayer(props: VideoPlayerProps) {
  // TODO error boundary
  // TODO move error boundary to only decorated, <VideoPlayer /> shouldn't have styling
  // TODO internal controls

  return (
    <VideoPlayerContextProvider>
      <div className="is-video-player relative h-full w-full select-none overflow-hidden bg-black [border-left:env(safe-area-inset-left)_solid_transparent] [border-right:env(safe-area-inset-right)_solid_transparent]">
        <div className="absolute inset-0">{props.children}</div>
      </div>
    </VideoPlayerContextProvider>
  );
}
