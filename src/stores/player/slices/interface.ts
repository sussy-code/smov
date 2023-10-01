import { MakeSlice } from "@/stores/player/slices/types";

export enum VideoPlayerTimeFormat {
  REGULAR = 0,
  REMAINING = 1,
}

export enum PlayerHoverState {
  NOT_HOVERING = "not_hovering",
  MOUSE_HOVER = "mouse_hover",
  MOBILE_TAPPED = "mobile_tapped",
}

export interface InterfaceSlice {
  interface: {
    isFullscreen: boolean;
    hovering: PlayerHoverState;

    volumeChangedWithKeybind: boolean; // has the volume recently been adjusted with the up/down arrows recently?
    volumeChangedWithKeybindDebounce: NodeJS.Timeout | null; // debounce for the duration of the "volume changed thingamajig"

    leftControlHovering: boolean; // is the cursor hovered over the left side of player controls
    timeFormat: VideoPlayerTimeFormat; // Time format of the video player
  };
  updateInterfaceHovering(newState: PlayerHoverState): void;
}

export const createInterfaceSlice: MakeSlice<InterfaceSlice> = (set) => ({
  interface: {
    isFullscreen: false,
    leftControlHovering: false,
    hovering: PlayerHoverState.NOT_HOVERING,
    volumeChangedWithKeybind: false,
    volumeChangedWithKeybindDebounce: null,
    timeFormat: VideoPlayerTimeFormat.REGULAR,
  },

  updateInterfaceHovering(newState: PlayerHoverState) {
    set((s) => {
      console.log("setting", newState);
      s.interface.hovering = newState;
    });
  },
});
