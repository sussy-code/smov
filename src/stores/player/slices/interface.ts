import { DisplayError } from "@/components/player/display/displayInterface";
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
    lastVolume: number;
    hasOpenOverlay: boolean;
    hovering: PlayerHoverState;
    lastHoveringState: PlayerHoverState;
    canAirplay: boolean;
    isCasting: boolean;
    hideNextEpisodeBtn: boolean;
    shouldStartFromBeginning: boolean;
    error?: DisplayError;

    volumeChangedWithKeybind: boolean; // has the volume recently been adjusted with the up/down arrows recently?
    volumeChangedWithKeybindDebounce: NodeJS.Timeout | null; // debounce for the duration of the "volume changed thingamajig"

    leftControlHovering: boolean; // is the cursor hovered over the left side of player controls
    isHoveringControls: boolean; // is the cursor hovered over any controls?
    timeFormat: VideoPlayerTimeFormat; // Time format of the video player
  };
  updateInterfaceHovering(newState: PlayerHoverState): void;
  setSeeking(seeking: boolean): void;
  setTimeFormat(format: VideoPlayerTimeFormat): void;
  setHoveringLeftControls(state: boolean): void;
  setHoveringAnyControls(state: boolean): void;
  setHasOpenOverlay(state: boolean): void;
  setLastVolume(state: number): void;
  hideNextEpisodeButton(): void;
  setShouldStartFromBeginning(val: boolean): void;
}

export const createInterfaceSlice: MakeSlice<InterfaceSlice> = (set, get) => ({
  interface: {
    isCasting: false,
    hasOpenOverlay: false,
    isFullscreen: false,
    isSeeking: false,
    lastVolume: 0,
    leftControlHovering: false,
    isHoveringControls: false,
    hovering: PlayerHoverState.NOT_HOVERING,
    lastHoveringState: PlayerHoverState.NOT_HOVERING,
    volumeChangedWithKeybind: false,
    volumeChangedWithKeybindDebounce: null,
    timeFormat: VideoPlayerTimeFormat.REGULAR,
    canAirplay: false,
    hideNextEpisodeBtn: false,
    shouldStartFromBeginning: false,
  },

  setShouldStartFromBeginning(val) {
    set((s) => {
      s.interface.shouldStartFromBeginning = val;
    });
  },
  setLastVolume(state) {
    set((s) => {
      s.interface.lastVolume = state;
    });
  },
  setHasOpenOverlay(state) {
    set((s) => {
      s.interface.hasOpenOverlay = state;
    });
  },
  setTimeFormat(format) {
    set((s) => {
      s.interface.timeFormat = format;
    });
  },
  updateInterfaceHovering(newState: PlayerHoverState) {
    set((s) => {
      if (newState !== PlayerHoverState.NOT_HOVERING)
        s.interface.lastHoveringState = newState;
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
  setHoveringAnyControls(state) {
    set((s) => {
      s.interface.isHoveringControls = state;
    });
  },
  hideNextEpisodeButton() {
    set((s) => {
      s.interface.hideNextEpisodeBtn = true;
    });
  },
});
