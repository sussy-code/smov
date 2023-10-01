import { MWStreamType } from "@/backend/helpers/streams";
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

  return {
    status,
    playMedia(source: Source) {
      display?.load(source);
      setStatus(playerStatus.PLAYING);
    },
    setScrapeStatus() {
      setStatus(playerStatus.SCRAPING);
    },
  };
}
