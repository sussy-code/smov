import Hls from "hls.js";

import {
  MWCaption,
  MWStreamQuality,
  MWStreamType,
} from "@/backend/helpers/streams";
import { DetailedMeta } from "@/backend/metadata/getmeta";

import { VideoPlayerStateProvider } from "./providers/providerTypes";

export type VideoPlayerMeta = {
  meta: DetailedMeta;
  captions: MWCaption[];
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

export enum VideoPlayerTimeFormat {
  REGULAR = 0,
  REMAINING = 1,
}

export type VideoPlayerState = {
  // state related to the user interface
  interface: {
    isFullscreen: boolean;
    popout: string | null; // id of current popout (eg source select, episode select)
    isFocused: boolean; // is the video player the users focus? (shortcuts only works when its focused)
    volumeChangedWithKeybind: boolean; // has the volume recently been adjusted with the up/down arrows recently?
    volumeChangedWithKeybindDebounce: NodeJS.Timeout | null; // debounce for the duration of the "volume changed thingamajig"
    leftControlHovering: boolean; // is the cursor hovered over the left side of player controls
    popoutBounds: null | DOMRect; // bounding box of current popout
    timeFormat: VideoPlayerTimeFormat; // Time format of the video player
  };

  // state related to the playing state of the media
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

  // state related to video progress
  progress: {
    time: number;
    duration: number;
    buffered: number;
    draggingTime: number;
  };

  // meta data of video
  meta: null | VideoPlayerMeta;
  source: null | {
    quality: MWStreamQuality;
    url: string;
    type: MWStreamType;
    providerId?: string;
    embedId?: string;
    caption: null | {
      url: string;
      id: string;
    };
  };

  // casting state
  casting: {
    isCasting: boolean;
    controller: cast.framework.RemotePlayerController | null;
    player: cast.framework.RemotePlayer | null;
    instance: cast.framework.CastContext | null;
  };

  // misc
  canAirplay: boolean;
  initalized: boolean;
  stateProviderId: string;
  error: null | {
    name: string;
    description: string;
  };

  // backing fields
  pausedWhenSeeking: boolean; // when seeking, used to store if paused when started to seek
  hlsInstance: null | Hls; // HLS video player instance storage
  stateProvider: VideoPlayerStateProvider | null;
  wrapperElement: HTMLDivElement | null;
};
