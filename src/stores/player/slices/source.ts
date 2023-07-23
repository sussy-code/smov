import { MWStreamType } from "@/backend/helpers/streams";
import { MakeSlice } from "@/stores/player/slices/types";
import { ValuesOf } from "@/utils/typeguard";

export const playerStatus = {
  IDLE: "idle",
  SCRAPING: "scraping",
  PLAYING: "playing",
} as const;

export type PlayerStatus = ValuesOf<typeof playerStatus>;

export interface SourceSlice {
  status: PlayerStatus;
  source: {
    url: string;
    type: MWStreamType;
  } | null;
  setStatus(status: PlayerStatus): void;
  setSource(url: string, type: MWStreamType): void;
}

export const createSourceSlice: MakeSlice<SourceSlice> = (set) => ({
  source: null,
  status: playerStatus.IDLE,
  setStatus(status: PlayerStatus) {
    set((s) => {
      s.status = status;
    });
  },
  setSource(url: string, type: MWStreamType) {
    set((s) => {
      s.source = {
        type,
        url,
      };
    });
  },
});
