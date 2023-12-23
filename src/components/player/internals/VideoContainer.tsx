import { ReactNode, useEffect, useMemo, useRef } from "react";

import { makeVideoElementDisplayInterface } from "@/components/player/display/base";
import { convertSubtitlesToObjectUrl } from "@/components/player/utils/captions";
import { playerStatus } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

import { useInitializeSource } from "../hooks/useInitializePlayer";

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

function useObjectUrl(cb: () => string | null, deps: any[]) {
  const lastObjectUrl = useRef<string | null>(null);
  const output = useMemo(() => {
    if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current);
    const data = cb();
    lastObjectUrl.current = data;
    return data;
    // deps are passed in, cb is known not to be changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    return () => {
      // this is intentionally done only in cleanup
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current);
    };
  }, []);

  return output;
}

function VideoElement() {
  const videoEl = useRef<HTMLVideoElement>(null);
  const trackEl = useRef<HTMLTrackElement>(null);
  const display = usePlayerStore((s) => s.display);
  const srtData = usePlayerStore((s) => s.caption.selected?.srtData);
  const captionAsTrack = usePlayerStore((s) => s.caption.asTrack);
  const language = usePlayerStore((s) => s.caption.selected?.language);
  const trackObjectUrl = useObjectUrl(
    () => (srtData ? convertSubtitlesToObjectUrl(srtData) : null),
    [srtData],
  );

  // report video element to display interface
  useEffect(() => {
    if (display && videoEl.current) {
      display.processVideoElement(videoEl.current);
    }
  }, [display, videoEl]);

  // select track as showing if it exists
  useEffect(() => {
    if (trackEl.current) {
      trackEl.current.track.mode = "showing";
    }
  }, [trackEl]);

  let subtitleTrack: ReactNode = null;
  if (captionAsTrack && trackObjectUrl && language)
    subtitleTrack = (
      <track
        label="movie-web"
        kind="subtitles"
        srcLang={language}
        src={trackObjectUrl}
        default
      />
    );

  return (
    <video
      className="absolute inset-0 w-full h-screen bg-black"
      autoPlay
      playsInline
      ref={videoEl}
    >
      {subtitleTrack}
    </video>
  );
}

export function VideoContainer() {
  const show = useShouldShowVideoElement();
  useDisplayInterface();
  useInitializeSource();

  if (!show) return null;
  return <VideoElement />;
}
