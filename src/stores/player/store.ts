import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { createInterfaceSlice } from "@/stores/player/slices/interface";
import { createPlayingSlice } from "@/stores/player/slices/playing";
import { createProgressSlice } from "@/stores/player/slices/progress";
import { createSourceSlice } from "@/stores/player/slices/source";
import { AllSlices } from "@/stores/player/slices/types";

export const usePlayerStore = create(
  immer<AllSlices>((...a) => ({
    ...createInterfaceSlice(...a),
    ...createProgressSlice(...a),
    ...createPlayingSlice(...a),
    ...createSourceSlice(...a),
  }))
);
