import { StateCreator } from "zustand";

import { InterfaceSlice } from "@/stores/player/slices/interface";
import { PlayingSlice } from "@/stores/player/slices/playing";
import { ProgressSlice } from "@/stores/player/slices/progress";
import { SourceSlice } from "@/stores/player/slices/source";

export type AllSlices = InterfaceSlice &
  PlayingSlice &
  ProgressSlice &
  SourceSlice;
export type MakeSlice<Slice> = StateCreator<
  AllSlices,
  [["zustand/immer", never]],
  [],
  Slice
>;
