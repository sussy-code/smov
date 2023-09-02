import { PauseAction } from "@/video/components/actions/PauseAction";
import {
  SkipTimeBackwardAction,
  SkipTimeForwardAction,
} from "@/video/components/actions/SkipTimeAction";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";

export function MobileCenterAction() {
  const descriptor = useVideoPlayerDescriptor();
  const mediaPlaying = useMediaPlaying(descriptor);

  const isLoading = mediaPlaying.isFirstLoading || mediaPlaying.isLoading;

  return (
    <div className="flex items-center space-x-8">
      <SkipTimeBackwardAction />
      <PauseAction
        iconSize="text-5xl"
        className={isLoading ? "pointer-events-none opacity-0" : ""}
      />
      <SkipTimeForwardAction />
    </div>
  );
}
