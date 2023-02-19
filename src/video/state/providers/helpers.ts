import { resetForSource } from "@/video/state/init";
import { updateMediaPlaying } from "@/video/state/logic/mediaplaying";
import { updateMisc } from "@/video/state/logic/misc";
import { updateProgress } from "@/video/state/logic/progress";
import { VideoPlayerState } from "@/video/state/types";

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
