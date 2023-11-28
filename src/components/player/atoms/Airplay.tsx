import { Icons } from "@/components/Icon";
import { VideoPlayerButton } from "@/components/player/internals/Button";
import { usePlayerStore } from "@/stores/player/store";

export function Airplay() {
  const canAirplay = usePlayerStore((s) => s.interface.canAirplay);
  const display = usePlayerStore((s) => s.display);

  if (!canAirplay) return null;

  return (
    <VideoPlayerButton
      onClick={() => display?.startAirplay()}
      icon={Icons.AIRPLAY}
    />
  );
}
