import { useState } from "react";

import { useControls } from "@/_oldvideo/state/logic/controls";
import { useMediaPlaying } from "@/_oldvideo/state/logic/mediaplaying";

export function useVolumeControl(descriptor: string) {
  const [storedVolume, setStoredVolume] = useState(1);
  const controls = useControls(descriptor);
  const mediaPlaying = useMediaPlaying(descriptor);

  const toggleVolume = (isKeyboardEvent = false) => {
    if (mediaPlaying.volume > 0) {
      setStoredVolume(mediaPlaying.volume);
      controls.setVolume(0, isKeyboardEvent);
    } else {
      controls.setVolume(storedVolume > 0 ? storedVolume : 1, isKeyboardEvent);
    }
  };

  return {
    storedVolume,
    setStoredVolume,
    toggleVolume,
  };
}
