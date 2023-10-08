import { useCallback } from "react";

import { getStoredVolume } from "@/_oldvideo/components/hooks/volumeStore";
import { usePlayerStore } from "@/stores/player/store";

// TODO use new stored volume

export function useInitializePlayer() {
  const display = usePlayerStore((s) => s.display);

  const init = useCallback(() => {
    const storedVolume = getStoredVolume();
    display?.setVolume(storedVolume);
  }, [display]);

  return {
    init,
  };
}
