import React, { useCallback, useRef, useState } from "react";
import { useVideoPlayerState } from "../VideoContext";

interface BackdropControlProps {
  children?: React.ReactNode;
}

export function BackdropControl(props: BackdropControlProps) {
  const { videoState } = useVideoPlayerState();
  const [moved, setMoved] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickareaRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(() => {
    setMoved(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setMoved(false);
      timeout.current = null;
    }, 3000);
  }, [timeout, setMoved]);

  const handleMouseLeave = useCallback(() => {
    setMoved(false);
  }, [setMoved]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!clickareaRef.current || clickareaRef.current !== e.target) return;

      if (videoState.isPlaying) videoState.pause();
      else videoState.play();
    },
    [videoState, clickareaRef]
  );

  const showUI = moved || videoState.isPaused;

  return (
    <div
      className={`absolute inset-0 ${!showUI ? "cursor-none" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={clickareaRef}
      onClick={handleClick}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-200 ${
          !showUI ? "!opacity-0" : ""
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black to-transparent opacity-75 transition-opacity duration-200 ${
          !showUI ? "!opacity-0" : ""
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black to-transparent opacity-75 transition-opacity duration-200 ${
          !showUI ? "!opacity-0" : ""
        }`}
      />
      <div className="pointer-events-none absolute inset-0">
        {showUI ? props.children : null}
      </div>
    </div>
  );
}
