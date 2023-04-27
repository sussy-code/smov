import React, { useCallback, useEffect, useRef, useState } from "react";

import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useInterface } from "@/video/state/logic/interface";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";

interface BackdropActionProps {
  children?: React.ReactNode;
  onBackdropChange?: (showing: boolean) => void;
}

export function BackdropAction(props: BackdropActionProps) {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const mediaPlaying = useMediaPlaying(descriptor);
  const videoInterface = useInterface(descriptor);

  const [moved, setMoved] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickareaRef = useRef<HTMLDivElement>(null);

  const lastTouchEnd = useRef<number>(0);

  const handleMouseMove = useCallback(() => {
    if (!moved) {
      setTimeout(() => {
        // If NOT a touch, set moved to true
        const isTouch = Date.now() - lastTouchEnd.current < 200;
        if (!isTouch) setMoved(true);
      }, 20);
    }

    // remove after all
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setMoved(false);
      timeout.current = null;
    }, 3000);
  }, [setMoved, moved]);

  const handleMouseLeave = useCallback(() => {
    setMoved(false);
  }, [setMoved]);

  const handleClick = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (!clickareaRef.current || clickareaRef.current !== e.target) return;

      if (videoInterface.popout !== null) return;

      if ((e as React.TouchEvent).type === "touchend") {
        lastTouchEnd.current = Date.now();
        return;
      }

      if ((e as React.MouseEvent<HTMLDivElement>).button !== 0) {
        return; // not main button (left click), exit event
      }

      setTimeout(() => {
        if (Date.now() - lastTouchEnd.current < 200) {
          setMoved((v) => !v);
          return;
        }

        if (mediaPlaying.isPlaying) controls.pause();
        else controls.play();
      }, 20);
    },
    [controls, mediaPlaying, videoInterface]
  );
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!clickareaRef.current || clickareaRef.current !== e.target) return;

      if (!videoInterface.isFullscreen) controls.enterFullscreen();
      else controls.exitFullscreen();
    },
    [controls, videoInterface]
  );

  const lastBackdropValue = useRef<boolean | null>(null);
  useEffect(() => {
    const currentValue =
      moved || mediaPlaying.isPaused || !!videoInterface.popout;
    if (currentValue !== lastBackdropValue.current) {
      lastBackdropValue.current = currentValue;
      props.onBackdropChange?.(currentValue);
    }
  }, [moved, mediaPlaying, props, videoInterface]);
  const showUI = moved || mediaPlaying.isPaused || !!videoInterface.popout;

  return (
    <div
      className={`absolute inset-0 ${!showUI ? "cursor-none" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={clickareaRef}
      onMouseUp={handleClick}
      onTouchEnd={handleClick}
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
