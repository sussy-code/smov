import { MakeSlice } from "@/stores/player/slices/types";

export interface ProgressSlice {
  progress: {
    time: number; // current time of video
    duration: number; // length of video
    buffered: number; // how much is buffered
    draggingTime: number; // when dragging, time thats at the cursor
  };
  setDraggingTime(draggingTime: number): void;
}

export const createProgressSlice: MakeSlice<ProgressSlice> = (set) => ({
  progress: {
    time: 0,
    duration: 0,
    buffered: 0,
    draggingTime: 0,
  },
  setDraggingTime(draggingTime: number) {
    set((s) => {
      s.progress.draggingTime = draggingTime;
    });
  },
});
