import React, { useCallback, useEffect, useRef, useState } from "react";
import { useVideoPlayerState } from "../VideoContext";

interface BackdropControlProps {
  children?: React.ReactNode;
  onBackdropChange?: (showing: boolean) => void;
}

export function BackdropControl(props: BackdropControlProps) {
  const { videoState } = useVideoPlayerState();
  const [moved, setMoved] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickareaRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(() => {
    if (!moved) setMoved(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (moved) setMoved(false);
      timeout.current = null;
    }, 3000);
  }, [setMoved, moved]);

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
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!clickareaRef.current || clickareaRef.current !== e.target) return;

      if (!videoState.isFullscreen) videoState.enterFullscreen();
      else videoState.exitFullscreen();
    },
    [videoState, clickareaRef]
  );

  const lastBackdropValue = useRef<boolean | null>(null);
  useEffect(() => {
    const currentValue = moved || videoState.isPaused;
    if (currentValue !== lastBackdropValue.current) {
      lastBackdropValue.current = currentValue;
      props.onBackdropChange?.(currentValue);
    }
  }, [videoState, moved, props]);
  const showUI = moved || videoState.isPaused;

  return (
    <div
      className={`absolute inset-0 ${!showUI ? "cursor-none" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={clickareaRef}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-200 ${
          !showUI ? "!opacity-0" : ""
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-black to-transparent transition-opacity duration-200 ${
          !showUI ? "!opacity-0" : ""
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-black to-transparent transition-opacity duration-200 ${
          !showUI ? "!opacity-0" : ""
        }`}
      />
      <div className="pointer-events-none absolute inset-0">
        {props.children}
      </div>
    </div>
  );
}
