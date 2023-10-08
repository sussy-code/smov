import { MWStreamType } from "@/backend/helpers/streams";
import { useInitializePlayer } from "@/components/player/hooks/useInitializePlayer";
import { playerStatus } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

export interface Source {
  url: string;
  type: MWStreamType;
}

export function usePlayer() {
  const setStatus = usePlayerStore((s) => s.setStatus);
  const status = usePlayerStore((s) => s.status);
  const display = usePlayerStore((s) => s.display);
  const { init } = useInitializePlayer();

  return {
    status,
    playMedia(source: Source) {
      display?.load(source);
      setStatus(playerStatus.PLAYING);
      init();
    },
    setScrapeStatus() {
      setStatus(playerStatus.SCRAPING);
    },
  };
}
