import { MWStreamType } from "@/backend/helpers/streams";
import { playerStatus } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

export interface Source {
  url: string;
  type: MWStreamType;
}

export function usePlayer() {
  const setStatus = usePlayerStore((s) => s.setStatus);
  const setSource = usePlayerStore((s) => s.setSource);

  return {
    playMedia(source: Source) {
      setSource(source.url, source.type);
      setStatus(playerStatus.PLAYING);
    },
  };
}
