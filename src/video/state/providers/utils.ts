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

export function handleBuffered(time: number, buffered: TimeRanges): number {
  for (let i = 0; i < buffered.length; i += 1) {
    if (buffered.start(buffered.length - 1 - i) < time) {
      return buffered.end(buffered.length - 1 - i);
    }
  }
  return 0;
}
