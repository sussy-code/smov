import { VideoPlayerState } from "./types";

export const _players: Map<string, VideoPlayerState> = new Map();

export function getPlayerState(descriptor: string): VideoPlayerState {
  const state = _players.get(descriptor);
  if (!state) throw new Error("invalid descriptor or has been unregistered");
  return state;
}
