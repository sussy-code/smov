import { MakeSlice } from "@/stores/player/slices/types";

export interface PlayingSlice {
  mediaPlaying: {
    isPlaying: boolean;
    isPaused: boolean;
    isSeeking: boolean; // seeking with progress bar
    isDragSeeking: boolean; // is seeking for our custom progress bar
    isLoading: boolean; // buffering or not
    hasPlayedOnce: boolean; // has the video played at all?
    volume: number;
    playbackRate: number;
  };
  playingTitle: {
    id: string;
    title: string;
    type: string;
  };
  play(): void;
  pause(): void;
  setPlayingTitle(id: string, title: string, type: string): void;
}

export const createPlayingSlice: MakeSlice<PlayingSlice> = (set) => ({
  mediaPlaying: {
    isPlaying: false,
    isPaused: true,
    isLoading: false,
    isSeeking: false,
    isDragSeeking: false,
    hasPlayedOnce: false,
    volume: 1,
    playbackRate: 1,
  },
  playingTitle: {
    id: "",
    type: "",
    title: "",
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
      state.mediaPlaying.isPaused = true;
    });
  },
  setPlayingTitle(id: string, title: string, type: string) {
    set((state) => {
      state.playingTitle.id = id;
      state.playingTitle.type = type;
      state.playingTitle.title = title;
    });
  },
});
