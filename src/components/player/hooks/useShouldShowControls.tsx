import { PlayerHoverState } from "@/stores/player/slices/interface";
import { usePlayerStore } from "@/stores/player/store";

export function useShouldShowControls() {
  const hovering = usePlayerStore((s) => s.interface.hovering);
  const lastHoveringState = usePlayerStore(
    (s) => s.interface.lastHoveringState
  );
  const isPaused = usePlayerStore((s) => s.mediaPlaying.isPaused);
  const hasOpenOverlay = usePlayerStore((s) => s.interface.hasOpenOverlay);

  const isUsingTouch = lastHoveringState === PlayerHoverState.MOBILE_TAPPED;
  const isHovering = hovering !== PlayerHoverState.NOT_HOVERING;

  // when using touch, pause screens can be dismissed by tapping
  const showTargetsWithoutPause = isHovering || hasOpenOverlay;
  const showTargetsIncludingPause = showTargetsWithoutPause || isPaused;
  const showTargets = isUsingTouch
    ? showTargetsWithoutPause
    : showTargetsIncludingPause;

  return {
    showTouchTargets: isUsingTouch && showTargets,
    showTargets,
  };
}
