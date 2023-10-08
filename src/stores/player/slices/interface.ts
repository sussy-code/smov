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
    isSeeking: boolean;
    hovering: PlayerHoverState;

    volumeChangedWithKeybind: boolean; // has the volume recently been adjusted with the up/down arrows recently?
    volumeChangedWithKeybindDebounce: NodeJS.Timeout | null; // debounce for the duration of the "volume changed thingamajig"

    leftControlHovering: boolean; // is the cursor hovered over the left side of player controls
    timeFormat: VideoPlayerTimeFormat; // Time format of the video player
  };
  updateInterfaceHovering(newState: PlayerHoverState): void;
  setSeeking(seeking: boolean): void;
  setTimeFormat(format: VideoPlayerTimeFormat): void;
  setHoveringLeftControls(state: boolean): void;
}

export const createInterfaceSlice: MakeSlice<InterfaceSlice> = (set, get) => ({
  interface: {
    isFullscreen: false,
    isSeeking: false,
    leftControlHovering: false,
    hovering: PlayerHoverState.NOT_HOVERING,
    volumeChangedWithKeybind: false,
    volumeChangedWithKeybindDebounce: null,
    timeFormat: VideoPlayerTimeFormat.REGULAR,
  },

  setTimeFormat(format) {
    set((s) => {
      s.interface.timeFormat = format;
    });
  },
  updateInterfaceHovering(newState: PlayerHoverState) {
    set((s) => {
      s.interface.hovering = newState;
    });
  },
  setSeeking(seeking) {
    const display = get().display;
    display?.setSeeking(seeking);
    set((s) => {
      s.interface.isSeeking = seeking;
    });
  },
  setHoveringLeftControls(state) {
    set((s) => {
      s.interface.leftControlHovering = state;
    });
  },
});
