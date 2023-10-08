import {
  getStoredVolume,
  setStoredVolume,
} from "@/_oldvideo/components/hooks/volumeStore";
import { usePlayerStore } from "@/stores/player/store";

// TODO use new stored volume

export function useVolume() {
  const volume = usePlayerStore((s) => s.mediaPlaying.volume);
  const display = usePlayerStore((s) => s.display);

  const toggleVolume = (_isKeyboardEvent = false) => {
    // TODO use keyboard event
    if (volume > 0) {
      setStoredVolume(volume);
      display?.setVolume(0);
    } else {
      const storedVolume = getStoredVolume();
      if (storedVolume > 0) display?.setVolume(storedVolume);
      else display?.setVolume(1);
    }
  };

  return {
    toggleMute() {
      toggleVolume();
    },
    setVolume(vol: number) {
      setStoredVolume(vol);
      display?.setVolume(vol);
    },
  };
}
