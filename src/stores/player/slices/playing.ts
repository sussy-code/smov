import { MakeSlice } from "@/stores/player/slices/types";

export interface PlayingSlice {
  mediaPlaying: {
    isPlaying: boolean;
    isPaused: boolean;
    isSeeking: boolean; // seeking with progress bar
    isDragSeeking: boolean; // is seeking for our custom progress bar
    isLoading: boolean; // buffering or not
    isFirstLoading: boolean; // first buffering of the video, when set to false the video can start playing
    hasPlayedOnce: boolean; // has the video played at all?
    volume: number;
    playbackSpeed: number;
  };
  play(): void;
  pause(): void;
}

export const createPlayingSlice: MakeSlice<PlayingSlice> = (set) => ({
  mediaPlaying: {
    isPlaying: false,
    isPaused: true,
    isLoading: false,
    isSeeking: false,
    isDragSeeking: false,
    isFirstLoading: true,
    hasPlayedOnce: false,
    volume: 0,
    playbackSpeed: 1,
  },
  play() {
    set((state) => {
      state.mediaPlaying.isPlaying = true;
      state.mediaPlaying.isPaused = false;
    });
  },
  pause() {
    set((state) => {
      state.mediaPlaying.isPlaying = false;
      state.mediaPlaying.isPaused = false;
    });
  },
});
