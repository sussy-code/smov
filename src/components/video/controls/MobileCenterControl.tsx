import { useVideoPlayerState } from "../VideoContext";
import { PauseControl } from "./PauseControl";
import { SkipTimeBackward, SkipTimeForward } from "./TimeControl";

export function MobileCenterControl() {
  const { videoState } = useVideoPlayerState();

  const isLoading = videoState.isFirstLoading || videoState.isLoading;

  return (
    <div className="flex items-center space-x-8">
      <SkipTimeBackward />
      <PauseControl
        iconSize="text-5xl"
        className={isLoading ? "pointer-events-none opacity-0" : ""}
      />
      <SkipTimeForward />
    </div>
  );
}
