import { useVideoPlayerState } from "@/../__old/VideoContext";
import { useState } from "react";

export function useVolumeControl() {
  const [storedVolume, setStoredVolume] = useState(1);
  const { videoState } = useVideoPlayerState();

  const toggleVolume = () => {
    if (videoState.volume > 0) {
      setStoredVolume(videoState.volume);
      videoState.setVolume(0);
    } else {
      videoState.setVolume(storedVolume > 0 ? storedVolume : 1);
    }
  };

  return {
    storedVolume,
    setStoredVolume,
    toggleVolume,
  };
}
