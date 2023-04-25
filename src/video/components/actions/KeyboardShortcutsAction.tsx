import { useEffect, useRef } from "react";

import { useVolumeControl } from "@/hooks/useVolumeToggle";
import { getPlayerState } from "@/video/state/cache";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useInterface } from "@/video/state/logic/interface";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";
import { useProgress } from "@/video/state/logic/progress";

export function KeyboardShortcutsAction() {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const videoInterface = useInterface(descriptor);
  const mediaPlaying = useMediaPlaying(descriptor);
  const progress = useProgress(descriptor);
  const { toggleVolume } = useVolumeControl(descriptor);

  const curTime = useRef<number>(0);
  useEffect(() => {
    curTime.current = progress.time;
  }, [progress]);

  useEffect(() => {
    const state = getPlayerState(descriptor);
    const el = state.wrapperElement;
    if (!el) return;

    let isRolling = false;
    const onKeyDown = (evt: KeyboardEvent) => {
      if (!videoInterface.isFocused) return;

      switch (evt.key.toLowerCase()) {
        // Toggle fullscreen
        case "f":
          if (videoInterface.isFullscreen) {
            controls.exitFullscreen();
          } else {
            controls.enterFullscreen();
          }
          break;

        // Skip backwards
        case "arrowleft":
          controls.setTime(curTime.current - 5);
          break;

        // Skip forward
        case "arrowright":
          controls.setTime(curTime.current + 5);
          break;

        // Pause / play
        case " ":
          if (mediaPlaying.isPaused) {
            controls.play();
          } else {
            controls.pause();
          }
          break;

        // Mute
        case "m":
          toggleVolume(true);
          break;

        // Decrease volume
        case "arrowdown":
          controls.setVolume(Math.max(mediaPlaying.volume - 0.1, 0), true);
          break;

        // Increase volume
        case "arrowup":
          controls.setVolume(Math.min(mediaPlaying.volume + 0.1, 1), true);
          break;

        // Do a barrel Roll!
        case "r":
          if (isRolling || evt.ctrlKey || evt.metaKey) return;
          isRolling = true;
          el.classList.add("roll");
          setTimeout(() => {
            isRolling = false;
            el.classList.remove("roll");
          }, 1000);
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [controls, descriptor, mediaPlaying, videoInterface, toggleVolume]);

  return null;
}
