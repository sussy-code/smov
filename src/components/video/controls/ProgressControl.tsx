import {
  makePercentage,
  makePercentageString,
  useProgressBar,
} from "@/hooks/useProgressBar";
import { useCallback, useEffect, useRef } from "react";
import { useVideoPlayerState } from "../VideoContext";

export function ProgressControl() {
  const { videoState } = useVideoPlayerState();
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<boolean>(false);

  const commitTime = useCallback(
    (percentage) => {
      videoState.setTime(percentage * videoState.duration);
    },
    [videoState]
  );
  const { dragging, dragPercentage, dragMouseDown } = useProgressBar(
    ref,
    commitTime
  );
  useEffect(() => {
    if (dragRef.current === dragging) return;
    dragRef.current = dragging;
    videoState.setSeeking(dragging);
  }, [dragRef, dragging, videoState]);

  let watchProgress = makePercentageString(
    makePercentage((videoState.time / videoState.duration) * 100)
  );
  if (dragging)
    watchProgress = makePercentageString(makePercentage(dragPercentage));

  const bufferProgress = makePercentageString(
    makePercentage((videoState.buffered / videoState.duration) * 100)
  );

  return (
    <div className="group pointer-events-auto cursor-pointer rounded-full px-2">
      <div
        ref={ref}
        className="-my-3 flex h-8 items-center"
        onMouseDown={dragMouseDown}
      >
        <div
          className={`relative h-1 flex-1 rounded-full bg-gray-500 bg-opacity-50 transition-[height] duration-100 group-hover:h-2 ${
            dragging ? "!h-2" : ""
          }`}
        >
          <div
            className="absolute inset-y-0 left-0 flex items-center justify-end rounded-full bg-gray-300 bg-opacity-20"
            style={{
              width: bufferProgress,
            }}
          />
          <div
            className="absolute inset-y-0 left-0 flex items-center justify-end rounded-full bg-bink-600"
            style={{
              width: watchProgress,
            }}
          >
            <div
              className={`absolute h-1 w-1 translate-x-1/2 rounded-full bg-white opacity-0 transition-[transform,opacity] group-hover:scale-[400%] group-hover:opacity-100 ${
                dragging ? "!scale-[400%] !opacity-100" : ""
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
