import { PlayerHoverState } from "@/stores/player/slices/interface";
import { usePlayerStore } from "@/stores/player/store";

export function useShouldShowControls() {
  const { hovering } = usePlayerStore((s) => s.interface);
  const { isPaused } = usePlayerStore((s) => s.mediaPlaying);

  return hovering !== PlayerHoverState.NOT_HOVERING || isPaused;
}
