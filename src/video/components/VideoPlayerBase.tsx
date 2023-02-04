import { WrapperRegisterInternal } from "@/video/components/internal/WrapperRegisterInternal";
import { useRef } from "react";
import { VideoPlayerContextProvider } from "../state/hooks";
import { VideoElementInternal } from "./internal/VideoElementInternal";

export interface VideoPlayerBaseProps {
  children?: React.ReactNode;
  autoPlay?: boolean;
}

export function VideoPlayerBase(props: VideoPlayerBaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  // TODO error boundary
  // TODO move error boundary to only decorated, <VideoPlayer /> shouldn't have styling
  // TODO internal controls

  return (
    <VideoPlayerContextProvider>
      <div
        ref={ref}
        className="is-video-player relative h-full w-full select-none overflow-hidden bg-black [border-left:env(safe-area-inset-left)_solid_transparent] [border-right:env(safe-area-inset-right)_solid_transparent]"
      >
        <VideoElementInternal autoPlay={props.autoPlay} />
        <WrapperRegisterInternal wrapper={ref.current} />
        <div className="absolute inset-0">{props.children}</div>
      </div>
    </VideoPlayerContextProvider>
  );
}
