import { MakeSlice } from "@/stores/player/slices/types";

export enum VideoPlayerTimeFormat {
  REGULAR = 0,
  REMAINING = 1,
}

export interface InterfaceSlice {
  interface: {
    isFullscreen: boolean;

    volumeChangedWithKeybind: boolean; // has the volume recently been adjusted with the up/down arrows recently?
    volumeChangedWithKeybindDebounce: NodeJS.Timeout | null; // debounce for the duration of the "volume changed thingamajig"

    leftControlHovering: boolean; // is the cursor hovered over the left side of player controls
    timeFormat: VideoPlayerTimeFormat; // Time format of the video player
  };
}

export const createInterfaceSlice: MakeSlice<InterfaceSlice> = () => ({
  interface: {
    isFullscreen: false,
    leftControlHovering: false,
    volumeChangedWithKeybind: false,
    volumeChangedWithKeybindDebounce: null,
    timeFormat: VideoPlayerTimeFormat.REGULAR,
  },
});
