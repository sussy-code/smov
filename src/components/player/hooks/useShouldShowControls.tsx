import { PlayerHoverState } from "@/stores/player/slices/interface";
import { usePlayerStore } from "@/stores/player/store";

export function useShouldShowControls() {
  const hovering = usePlayerStore((s) => s.interface.hovering);
  const lastHoveringState = usePlayerStore(
    (s) => s.interface.lastHoveringState,
  );
  const isPaused = usePlayerStore((s) => s.mediaPlaying.isPaused);
  const hasOpenOverlay = usePlayerStore((s) => s.interface.hasOpenOverlay);
  const isHoveringControls = usePlayerStore(
    (s) => s.interface.isHoveringControls,
  );

  const isUsingTouch = lastHoveringState === PlayerHoverState.MOBILE_TAPPED;
  const isHovering = hovering !== PlayerHoverState.NOT_HOVERING;

  // when using touch, pause screens can be dismissed by tapping
  const showTargetsWithoutPause =
    isHovering || (isHoveringControls && !isUsingTouch) || hasOpenOverlay;
  const showTargetsIncludingPause = showTargetsWithoutPause || isPaused;
  const showTargets = isUsingTouch
    ? showTargetsWithoutPause
    : showTargetsIncludingPause;

  return {
    showTouchTargets: isUsingTouch && showTargets,
    showTargets,
  };
}
