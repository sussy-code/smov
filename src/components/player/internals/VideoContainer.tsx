import { useEffect, useRef } from "react";

import { makeVideoElementDisplayInterface } from "@/components/player/display/base";
import { playerStatus } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

// initialize display interface
function useDisplayInterface() {
  const display = usePlayerStore((s) => s.display);
  const setDisplay = usePlayerStore((s) => s.setDisplay);

  useEffect(() => {
    if (!display) {
      setDisplay(makeVideoElementDisplayInterface());
    }
  }, [display, setDisplay]);
}

function useShouldShowVideoElement() {
  const status = usePlayerStore((s) => s.status);

  if (status !== playerStatus.PLAYING) return false;
  return true;
}

function VideoElement() {
  const videoEl = useRef<HTMLVideoElement>(null);
  const display = usePlayerStore((s) => s.display);

  // report video element to display interface
  useEffect(() => {
    if (display && videoEl.current) {
      display.processVideoElement(videoEl.current);
    }
  }, [display, videoEl]);

  return <video autoPlay ref={videoEl} />;
}

export function VideoContainer() {
  const show = useShouldShowVideoElement();
  useDisplayInterface();

  if (!show) return null;
  return <VideoElement />;
}
