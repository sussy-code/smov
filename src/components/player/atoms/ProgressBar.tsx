import { useCallback, useEffect, useRef } from "react";

import { useProgressBar } from "@/hooks/useProgressBar";
import { usePlayerStore } from "@/stores/player/store";

export function ProgressBar() {
  const { duration, time, buffered } = usePlayerStore((s) => s.progress);
  const display = usePlayerStore((s) => s.display);
  const setDraggingTime = usePlayerStore((s) => s.setDraggingTime);
  const setSeeking = usePlayerStore((s) => s.setSeeking);
  const { isSeeking } = usePlayerStore((s) => s.interface);

  const commitTime = useCallback(
    (percentage) => {
      display?.setTime(percentage * duration);
    },
    [duration, display]
  );

  const ref = useRef<HTMLDivElement>(null);

  const { dragging, dragPercentage, dragMouseDown } = useProgressBar(
    ref,
    commitTime
  );
  useEffect(() => {
    setSeeking(dragging);
  }, [setSeeking, dragging]);

  useEffect(() => {
    setDraggingTime((dragPercentage / 100) * duration);
  }, [setDraggingTime, duration, dragPercentage]);

  return (
    <div ref={ref}>
      <div
        className="group w-full h-8 flex items-center cursor-pointer"
        onMouseDown={dragMouseDown}
        onTouchStart={dragMouseDown}
      >
        <div
          className={[
            "relative w-full h-1 bg-video-progress-background bg-opacity-25 rounded-full transition-[height] duration-100 group-hover:h-1.5",
            dragging ? "!h-1.5" : "",
          ].join(" ")}
        >
          {/* Pre-loaded content bar */}
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-video-progress-preloaded bg-opacity-25 flex justify-end items-center"
            style={{
              width: `${(buffered / duration) * 100}%`,
            }}
          />

          {/* Actual progress bar */}
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-video-progress-watched flex justify-end items-center"
            style={{
              width: `${
                Math.max(
                  0,
                  Math.min(1, dragging ? dragPercentage / 100 : time / duration)
                ) * 100
              }%`,
            }}
          >
            <div
              className={[
                "w-[1rem] min-w-[1rem] h-[1rem] rounded-full transform translate-x-1/2 scale-0 group-hover:scale-100 bg-white transition-[transform] duration-100",
                isSeeking ? "scale-100" : "",
              ].join(" ")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
