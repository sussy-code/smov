import { BackdropControl } from "./controls/BackdropControl";
import { FullscreenControl } from "./controls/FullscreenControl";
import { LoadingControl } from "./controls/LoadingControl";
import { PauseControl } from "./controls/PauseControl";
import { ProgressControl } from "./controls/ProgressControl";
import { TimeControl } from "./controls/TimeControl";
import { VolumeControl } from "./controls/VolumeControl";
import { VideoPlayer, VideoPlayerProps } from "./VideoPlayer";

export function DecoratedVideoPlayer(props: VideoPlayerProps) {
  return (
    <VideoPlayer autoPlay={props.autoPlay}>
      <BackdropControl>
        <PauseControl />
        <FullscreenControl />
        <ProgressControl />
        <VolumeControl />
        <LoadingControl />
        <TimeControl />
      </BackdropControl>
      {props.children}
    </VideoPlayer>
  );
}
