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
    popoutBounds: null | DOMRect; // bounding box of current popout
  };

  // state related to the playing state of the media
  mediaPlaying: {
    isPlaying: boolean;
    isPaused: boolean;
    isSeeking: boolean; // seeking with progress bar
    isLoading: boolean; // buffering or not
    isFirstLoading: boolean; // first buffering of the video, when set to false the video can start playing
    hasPlayedOnce: boolean; // has the video played at all?
    volume: number;
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

  // misc
  canAirplay: boolean;
  initalized: boolean;
  error: null | {
    name: string;
    description: string;
  };

  // backing fields
  pausedWhenSeeking: boolean; // when seeking, used to store if paused when started to seek
  stateProvider: VideoPlayerStateProvider | null;
  wrapperElement: HTMLDivElement | null;
};
