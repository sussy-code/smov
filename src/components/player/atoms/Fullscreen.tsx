import { Icons } from "@/components/Icon";
import { VideoPlayerButton } from "@/components/player/internals/Button";
import { usePlayerStore } from "@/stores/player/store";

export function Fullscreen() {
  const { isFullscreen } = usePlayerStore((s) => s.interface);
  const display = usePlayerStore((s) => s.display);

  return (
    <VideoPlayerButton
      onClick={() => display?.toggleFullscreen()}
      icon={isFullscreen ? Icons.COMPRESS : Icons.EXPAND}
    />
  );
}
