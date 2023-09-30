import { usePlayerStore } from "@/stores/player/store";

export function Pause() {
  const display = usePlayerStore((s) => s.display);
  const { isPaused } = usePlayerStore((s) => s.mediaPlaying);

  const toggle = () => {
    if (isPaused) display?.play();
    else display?.pause();
  };

  return (
    <button type="button" onClick={toggle}>
      play/pause
    </button>
  );
}
