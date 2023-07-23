import { resetForSource } from "@/_oldvideo/state/init";
import { updateMediaPlaying } from "@/_oldvideo/state/logic/mediaplaying";
import { updateMisc } from "@/_oldvideo/state/logic/misc";
import { updateProgress } from "@/_oldvideo/state/logic/progress";
import { VideoPlayerState } from "@/_oldvideo/state/types";

export function resetStateForSource(descriptor: string, s: VideoPlayerState) {
  const state = s;
  if (state.hlsInstance) {
    state.hlsInstance.destroy();
    state.hlsInstance = null;
  }
  resetForSource(state);
  updateMediaPlaying(descriptor, state);
  updateProgress(descriptor, state);
  updateMisc(descriptor, state);
}
