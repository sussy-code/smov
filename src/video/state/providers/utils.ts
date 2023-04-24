import { updateMisc } from "@/video/state/logic/misc";

import { VideoPlayerStateProvider } from "./providerTypes";
import { getPlayerState } from "../cache";

export function setProvider(
  descriptor: string,
  provider: VideoPlayerStateProvider
) {
  const state = getPlayerState(descriptor);
  state.stateProvider = provider;
  state.initalized = true;
  state.stateProviderId = provider.getId();
  updateMisc(descriptor, state);
}

/**
 * Note: This only sets the state provider to null. it does not destroy the listener
 */
export function unsetStateProvider(
  descriptor: string,
  stateProviderId: string
) {
  const state = getPlayerState(descriptor);
  // dont do anything if state provider doesnt match the thing to unset
  if (
    !state.stateProvider ||
    state.stateProvider?.getId() !== stateProviderId
  ) {
    return;
  }
  state.stateProvider = null;
  state.stateProviderId = "video"; // go back to video when casting stops
  updateMisc(descriptor, state);
}

export function handleBuffered(time: number, buffered: TimeRanges): number {
  for (let i = 0; i < buffered.length; i += 1) {
    if (buffered.start(buffered.length - 1 - i) < time) {
      return buffered.end(buffered.length - 1 - i);
    }
  }
  return 0;
}
