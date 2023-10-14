import { useEffect, useRef } from "react";

import { makeVideoElementDisplayInterface } from "@/components/player/display/base";
import { playerStatus } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

// initialize display interface
function useDisplayInterface() {
  const display = usePlayerStore((s) => s.display);
  const setDisplay = usePlayerStore((s) => s.setDisplay);

  const displayRef = useRef(display);
  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    if (!displayRef.current) {
      const newDisplay = makeVideoElementDisplayInterface();
      displayRef.current = newDisplay;
      setDisplay(newDisplay);
    }
    return () => {
      if (displayRef.current) {
        displayRef.current = null;
        setDisplay(null);
      }
    };
  }, [setDisplay]);
}

export function useShouldShowVideoElement() {
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

  return (
    <video
      className="absolute inset-0 w-full h-screen bg-black"
      autoPlay
      playsInline
      ref={videoEl}
    />
  );
}

export function VideoContainer() {
  const show = useShouldShowVideoElement();
  useDisplayInterface();

  if (!show) return null;
  return <VideoElement />;
}
