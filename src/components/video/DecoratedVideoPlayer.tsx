import { BackdropControl } from "./controls/BackdropControl";
import { FullscreenControl } from "./controls/FullscreenControl";
import { LoadingControl } from "./controls/LoadingControl";
import { PauseControl } from "./controls/PauseControl";
import { ProgressControl } from "./controls/ProgressControl";
import { TimeControl } from "./controls/TimeControl";
import { VolumeControl } from "./controls/VolumeControl";
import { VideoPlayerHeader } from "./parts/VideoPlayerHeader";
import { VideoPlayer, VideoPlayerProps } from "./VideoPlayer";

// TODO animate items away when hidden

export function DecoratedVideoPlayer(props: VideoPlayerProps) {
  return (
    <VideoPlayer autoPlay={props.autoPlay}>
      <BackdropControl>
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingControl />
        </div>
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col px-4 pb-2">
          <ProgressControl />
          <div className="flex items-center px-2">
            <PauseControl />
            <VolumeControl className="mr-2" />
            <TimeControl />
            <div className="flex-1" />
            <FullscreenControl />
          </div>
        </div>
        <div className="pointer-events-auto absolute inset-x-0 top-0 flex flex-col py-6 px-8 pb-2">
          <VideoPlayerHeader title="Spiderman: Coming House" />
        </div>
      </BackdropControl>
      {props.children}
    </VideoPlayer>
  );
}
