import { PauseAction } from "@/_oldvideo/components/actions/PauseAction";
import {
  SkipTimeBackwardAction,
  SkipTimeForwardAction,
} from "@/_oldvideo/components/actions/SkipTimeAction";
import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { useMediaPlaying } from "@/_oldvideo/state/logic/mediaplaying";

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
