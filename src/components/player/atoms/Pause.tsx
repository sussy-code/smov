import { Icons } from "@/components/Icon";
import { VideoPlayerButton } from "@/components/player/internals/Button";
import { usePlayerStore } from "@/stores/player/store";

export function Pause(props: { iconSizeClass?: string; className?: string }) {
  const display = usePlayerStore((s) => s.display);
  const { isPaused } = usePlayerStore((s) => s.mediaPlaying);

  const toggle = () => {
    if (isPaused) display?.play();
    else display?.pause();
  };

  return (
    <VideoPlayerButton
      className={props.className}
      iconSizeClass={props.iconSizeClass}
      onClick={toggle}
      icon={isPaused ? Icons.PLAY : Icons.PAUSE}
    />
  );
}
