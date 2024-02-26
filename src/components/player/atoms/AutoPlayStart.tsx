import { useCallback } from "react";

import { Icon, Icons } from "@/components/Icon";
import { playerStatus } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

export function AutoPlayStart() {
  const display = usePlayerStore((s) => s.display);
  const isPlaying = usePlayerStore((s) => s.mediaPlaying.isPlaying);
  const isLoading = usePlayerStore((s) => s.mediaPlaying.isLoading);
  const hasPlayedOnce = usePlayerStore((s) => s.mediaPlaying.hasPlayedOnce);
  const status = usePlayerStore((s) => s.status);

  const handleClick = useCallback(() => {
    display?.play();
  }, [display]);

  if (hasPlayedOnce) return null;
  if (isPlaying) return null;
  if (isLoading) return null;
  if (status !== playerStatus.PLAYING) return null;

  return (
    <div
      onClick={handleClick}
      className="group pointer-events-auto flex h-16 w-16 cursor-pointer items-center justify-center bg-video-autoPlay-background hover:bg-video-autoPlay-hover rounded-full text-white transition-[background-color,transform] hover:scale-125 active:scale-100"
    >
      <Icon
        icon={Icons.PLAY}
        className="text-2xl transition-transform group-hover:scale-125"
      />
    </div>
  );
}
