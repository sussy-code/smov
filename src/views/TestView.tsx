import { FullscreenControl } from "@/components/video/controls/FullscreenControl";
import { PauseControl } from "@/components/video/controls/PauseControl";
import { SourceControl } from "@/components/video/controls/SourceControl";
import { VideoPlayer } from "@/components/video/VideoPlayer";

// test videos: https://gist.github.com/jsturgis/3b19447b304616f18657

export function TestView() {
  return (
    <VideoPlayer>
      <PauseControl />
      <FullscreenControl />
      <SourceControl source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
    </VideoPlayer>
  );
}
