import { FullscreenControl } from "@/components/video/controls/FullscreenControl";
import { PauseControl } from "@/components/video/controls/PauseControl";
import { ProgressControl } from "@/components/video/controls/ProgressControl";
import { SourceControl } from "@/components/video/controls/SourceControl";
import { VolumeControl } from "@/components/video/controls/VolumeControl";
import { VideoPlayer } from "@/components/video/VideoPlayer";

// test videos: https://gist.github.com/jsturgis/3b19447b304616f18657

// TODO video todos:
//  - captions
//  - make pretty
//  - show fullscreen button depending on is available (document.fullscreenEnabled)
//  - better seeking
//  - improve seekables
//  - buffering
//  - error handling
//  - auto-play prop option
//  - middle pause button
//  - improve pausing while seeking/buffering
//  - captions
//  - show formatted time
//  - IOS support: (no volume, fullscreen video element instead of wrapper)
//  - IpadOS support: (fullscreen video wrapper should work, see (lookmovie.io) )
//  - HLS support: feature detection otherwise use HLS.js
export function TestView() {
  return (
    <div className="w-[40rem] max-w-full">
      <VideoPlayer>
        <PauseControl />
        <FullscreenControl />
        <ProgressControl />
        <VolumeControl />
        <SourceControl source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" />
      </VideoPlayer>
    </div>
  );
}
