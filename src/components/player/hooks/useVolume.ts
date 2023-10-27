import { usePlayerStore } from "@/stores/player/store";
import { useVolumeStore } from "@/stores/volume";

export function useVolume() {
  const volume = usePlayerStore((s) => s.mediaPlaying.volume);
  const lastVolume = usePlayerStore((s) => s.interface.lastVolume);
  const setLastVolume = usePlayerStore((s) => s.setLastVolume);
  const display = usePlayerStore((s) => s.display);
  const setStoredVolume = useVolumeStore((s) => s.setVolume);

  const toggleVolume = () => {
    let newVolume = 0;

    if (volume > 0) {
      newVolume = 0;
      setLastVolume(volume);
    } else if (lastVolume > 0) newVolume = lastVolume;
    else newVolume = 1;

    display?.setVolume(newVolume);
    setStoredVolume(newVolume);
  };

  return {
    toggleMute() {
      toggleVolume();
    },
    setVolume(vol: number) {
      setStoredVolume(vol);
      setLastVolume(vol);
      display?.setVolume(vol);
    },
  };
}
