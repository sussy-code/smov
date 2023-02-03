import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";
import { VideoPlayerStateProvider } from "./providers/providerTypes";

export type VideoPlayerState = {
  isPlaying: boolean;
  isPaused: boolean;
  isSeeking: boolean;
  isLoading: boolean;
  isFirstLoading: boolean;
  isFullscreen: boolean;
  time: number;
  duration: number;
  volume: number;
  buffered: number;
  pausedWhenSeeking: boolean;
  hasInitialized: boolean;
  leftControlHovering: boolean;
  hasPlayedOnce: boolean;
  popout: string | null;
  isFocused: boolean;
  seasonData: {
    isSeries: boolean;
    current?: {
      episodeId: string;
      seasonId: string;
    };
    seasons?: {
      id: string;
      number: number;
      title: string;
      episodes?: { id: string; number: number; title: string }[];
    }[];
  };

  error: null | {
    name: string;
    description: string;
  };
  canAirplay: boolean;
  stateProvider: VideoPlayerStateProvider | null;
  source: null | {
    quality: MWStreamQuality;
    url: string;
    type: MWStreamType;
  };
};
