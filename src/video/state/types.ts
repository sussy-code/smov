import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";
import { MWMediaMeta } from "@/backend/metadata/types";
import { VideoPlayerStateProvider } from "./providers/providerTypes";

export type VideoPlayerMeta = {
  meta: MWMediaMeta;
  episode?: {
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

export type VideoPlayerState = {
  // state related to the user interface
  interface: {
    isFullscreen: boolean;
    popout: string | null; // id of current popout (eg source select, episode select)
    isFocused: boolean; // is the video player the users focus? (shortcuts only works when its focused)
    leftControlHovering: boolean; // is the cursor hovered over the left side of player controls
  };

  // state related to the playing state of the media
  mediaPlaying: {
    isPlaying: boolean;
    isPaused: boolean;
    isSeeking: boolean; // seeking with progress bar
    isLoading: boolean; // buffering or not
    isFirstLoading: boolean; // first buffering of the video, used to show
    hasPlayedOnce: boolean; // has the video played at all?
  };

  // state related to video progress
  progress: {
    time: number;
    duration: number;
    buffered: number;
  };

  // meta data of video
  meta: null | VideoPlayerMeta;
  source: null | {
    quality: MWStreamQuality;
    url: string;
    type: MWStreamType;
  };
  error: null | {
    name: string;
    description: string;
  };

  // misc
  volume: number;
  pausedWhenSeeking: boolean;
  hasInitialized: boolean;
  canAirplay: boolean;

  // backing fields
  stateProvider: VideoPlayerStateProvider | null;
  wrapperElement: HTMLDivElement | null;
};
