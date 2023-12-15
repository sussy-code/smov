import { MakeSlice } from "@/stores/player/slices/types";

export interface CastingSlice {
  casting: {
    instance: cast.framework.CastContext | null;
    player: cast.framework.RemotePlayer | null;
    controller: cast.framework.RemotePlayerController | null;
    setInstance(instance: cast.framework.CastContext): void;
    setPlayer(player: cast.framework.RemotePlayer): void;
    setController(controller: cast.framework.RemotePlayerController): void;
    setIsCasting(isCasting: boolean): void;
    clear(): void;
  };
}

export const createCastingSlice: MakeSlice<CastingSlice> = (set) => ({
  casting: {
    instance: null,
    player: null,
    controller: null,
    setInstance(instance) {
      set((s) => {
        s.casting.instance = instance;
      });
    },
    setPlayer(player) {
      set((s) => {
        s.casting.player = player;
      });
    },
    setController(controller) {
      set((s) => {
        s.casting.controller = controller;
      });
    },
    setIsCasting(isCasting) {
      set((s) => {
        s.interface.isCasting = isCasting;
      });
    },
    clear() {
      set((s) => {
        s.casting.instance = null;
      });
    },
  },
});
