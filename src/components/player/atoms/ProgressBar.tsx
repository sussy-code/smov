import {
  MouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useProgressBar } from "@/hooks/useProgressBar";
import { nearestImageAt } from "@/stores/player/slices/thumbnails";
import { usePlayerStore } from "@/stores/player/store";
import { durationExceedsHour, formatSeconds } from "@/utils/formatSeconds";

function ThumbnailDisplay(props: { at: number; show: boolean }) {
  const thumbnailImages = usePlayerStore((s) => s.thumbnails.images);
  const currentThumbnail = useMemo(() => {
    return nearestImageAt(thumbnailImages, props.at)?.image;
  }, [thumbnailImages, props.at]);
  const [offsets, setOffsets] = useState({
    offscreenLeft: 0,
    offscreenRight: 0,
  });
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const padding = 32;
    const left = Math.max(0, (rect.left - padding) * -1);
    const right = Math.max(0, rect.right + padding - window.innerWidth);

    setOffsets({
      offscreenLeft: left,
      offscreenRight: right,
    });
  }, [props.at]);

  if (!props.show || !currentThumbnail) return null;
  return (
    <div className="flex flex-col items-center -translate-x-1/2 pointer-events-none">
      <div className="w-screen flex justify-center">
        <div ref={ref}>
          <div
            style={{
              transform: `translateX(${
                offsets.offscreenLeft > 0
                  ? offsets.offscreenLeft
                  : -offsets.offscreenRight
              }px)`,
            }}
          >
            <img
              src={currentThumbnail.data}
              className="h-24 border rounded-xl border-gray-800"
            />
            <p className="text-center mt-1">
              {formatSeconds(
                Math.max(props.at, 0),
                durationExceedsHour(props.at),
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function useMouseHoverPosition(barRef: RefObject<HTMLDivElement>) {
  const [mousePos, setMousePos] = useState(-1);

  const mouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const bar = barRef.current;
      if (!bar) return;
      const rect = barRef.current.getBoundingClientRect();
      const pos = (e.pageX - rect.left) / barRef.current.offsetWidth;
      setMousePos(pos * 100);
    },
    [setMousePos, barRef],
  );

  const mouseLeave = useCallback(() => {
    setMousePos(-1);
  }, [setMousePos]);

  return { mousePos, mouseMove, mouseLeave };
}

export function ProgressBar() {
  const { duration, time, buffered } = usePlayerStore((s) => s.progress);
  const display = usePlayerStore((s) => s.display);
  const setDraggingTime = usePlayerStore((s) => s.setDraggingTime);
  const setSeeking = usePlayerStore((s) => s.setSeeking);
  const { isSeeking } = usePlayerStore((s) => s.interface);

  const commitTime = useCallback(
    (percentage: number) => {
      display?.setTime(percentage * duration);
    },
    [duration, display],
  );

  const ref = useRef<HTMLDivElement>(null);
  const { mouseMove, mouseLeave, mousePos } = useMouseHoverPosition(ref);

  const { dragging, dragPercentage, dragMouseDown } = useProgressBar(
    ref,
    commitTime,
  );
  useEffect(() => {
    setSeeking(dragging);
  }, [setSeeking, dragging]);

  useEffect(() => {
    setDraggingTime((dragPercentage / 100) * duration);
  }, [setDraggingTime, duration, dragPercentage]);

  return (
    <div className="w-full relative" dir="ltr">
      <div className="top-0 absolute inset-x-0">
        <div
          className="absolute bottom-0"
          style={{
            left: `${mousePos}%`,
          }}
        >
          <ThumbnailDisplay
            at={Math.floor((mousePos / 100) * duration)}
            show={mousePos > -1}
          />
        </div>
      </div>

      <div className="w-full" ref={ref}>
        <div
          className="group w-full h-8 flex items-center cursor-pointer"
          onMouseDown={dragMouseDown}
          onTouchStart={dragMouseDown}
          onMouseLeave={mouseLeave}
          onMouseMove={mouseMove}
        >
          <div
            className={[
              "relative w-full h-1 bg-progress-background bg-opacity-25 rounded-full transition-[height] duration-100 group-hover:h-1.5",
              dragging ? "!h-1.5" : "",
            ].join(" ")}
          >
            {/* Pre-loaded content bar */}
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-progress-preloaded bg-opacity-50 flex justify-end items-center"
              style={{
                width: `${(buffered / duration) * 100}%`,
              }}
            />

            {/* Actual progress bar */}
            <div
              className="absolute top-0 dir-neutral:left-0 h-full rounded-full bg-progress-filled flex justify-end items-center"
              style={{
                width: `${
                  Math.max(
                    0,
                    Math.min(
                      1,
                      dragging ? dragPercentage / 100 : time / duration,
                    ),
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
    </div>
  );
}
