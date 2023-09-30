import { MWStreamType } from "@/backend/helpers/streams";
import { DisplayInterface } from "@/components/player/display/displayInterface";
import { MakeSlice } from "@/stores/player/slices/types";
import { ValuesOf } from "@/utils/typeguard";

export const playerStatus = {
  IDLE: "idle",
  SCRAPING: "scraping",
  PLAYING: "playing",
} as const;

export type PlayerStatus = ValuesOf<typeof playerStatus>;

export interface SourceSliceSource {
  url: string;
  type: MWStreamType;
}

export interface SourceSlice {
  status: PlayerStatus;
  source: SourceSliceSource | null;
  display: DisplayInterface | null;
  setStatus(status: PlayerStatus): void;
  setSource(url: string, type: MWStreamType): void;
  setDisplay(display: DisplayInterface): void;
}

export const createSourceSlice: MakeSlice<SourceSlice> = (set, get) => ({
  source: null,
  status: playerStatus.IDLE,
  display: null,
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
  setDisplay(newDisplay: DisplayInterface) {
    const display = get().display;
    if (display) display.destroy();

    // make display events update the state
    newDisplay.on("pause", () =>
      set((s) => {
        s.mediaPlaying.isPaused = true;
        s.mediaPlaying.isPlaying = false;
      })
    );
    newDisplay.on("play", () =>
      set((s) => {
        s.mediaPlaying.isPaused = false;
        s.mediaPlaying.isPlaying = true;
      })
    );

    set((s) => {
      s.display = newDisplay;
    });
  },
});
