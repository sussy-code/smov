import { MWStreamType } from "@/backend/helpers/streams";
import { useInitializePlayer } from "@/components/player/hooks/useInitializePlayer";
import { PlayerMeta, playerStatus } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

export interface Source {
  url: string;
  type: MWStreamType;
}

export function usePlayer() {
  const setStatus = usePlayerStore((s) => s.setStatus);
  const setMeta = usePlayerStore((s) => s.setMeta);
  const status = usePlayerStore((s) => s.status);
  const display = usePlayerStore((s) => s.display);
  const { init } = useInitializePlayer();

  return {
    status,
    setMeta(meta: PlayerMeta) {
      setMeta(meta);
    },
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
