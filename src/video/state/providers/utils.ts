import { getPlayerState } from "../cache";
import { VideoPlayerStateProvider } from "./providerTypes";

export function setProvider(
  descriptor: string,
  provider: VideoPlayerStateProvider
) {
  const state = getPlayerState(descriptor);
  state.stateProvider = provider;
}

/**
 * Note: This only sets the state provider to null. it does not destroy the listener
 */
export function unsetStateProvider(descriptor: string) {
  const state = getPlayerState(descriptor);
  state.stateProvider = null;
}
