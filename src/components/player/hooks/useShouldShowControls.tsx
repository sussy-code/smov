import { PlayerHoverState } from "@/stores/player/slices/interface";
import { usePlayerStore } from "@/stores/player/store";

export function useShouldShowControls(opts?: { touchOnly: boolean }) {
  const hovering = usePlayerStore((s) => s.interface.hovering);
  const lastHoveringState = usePlayerStore(
    (s) => s.interface.lastHoveringState
  );
  const isPaused = usePlayerStore((s) => s.mediaPlaying.isPaused);
  const hasOpenOverlay = usePlayerStore((s) => s.interface.hasOpenOverlay);

  const showTouchControls =
    lastHoveringState === PlayerHoverState.MOBILE_TAPPED;
  const notNotHovering = hovering !== PlayerHoverState.NOT_HOVERING;

  if (opts?.touchOnly)
    return (showTouchControls && notNotHovering) || isPaused || hasOpenOverlay;

  return notNotHovering || isPaused || hasOpenOverlay;
}
