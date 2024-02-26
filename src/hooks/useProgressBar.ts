import React, { RefObject, useCallback, useEffect, useState } from "react";

export type MouseActivity = React.MouseEvent<HTMLElement> | MouseEvent;

type ActivityEvent = MouseActivity | React.TouchEvent<HTMLElement> | TouchEvent;

export function makePercentageString(num: number) {
  return `${num.toFixed(2)}%`;
}

export function makePercentage(num: number) {
  return Number(Math.max(0, Math.min(num, 100)).toFixed(2));
}

function isClickEvent(
  evt: ActivityEvent,
): evt is React.MouseEvent<HTMLElement> | MouseEvent {
  return (
    evt.type === "mousedown" ||
    evt.type === "mouseup" ||
    evt.type === "mousemove"
  );
}

const getEventX = (evt: ActivityEvent) => {
  return isClickEvent(evt) ? evt.pageX : evt.changedTouches[0].pageX;
};

export function useProgressBar(
  barRef: RefObject<HTMLElement>,
  commit: (percentage: number) => void,
  commitImmediately = false,
) {
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    function mouseMove(ev: ActivityEvent) {
      if (!mouseDown || !barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const pos = (getEventX(ev) - rect.left) / barRef.current.offsetWidth;
      setProgress(pos * 100);
      if (commitImmediately) commit(pos);
    }

    function mouseUp(ev: ActivityEvent) {
      if (!mouseDown) return;
      setMouseDown(false);
      document.body.removeAttribute("data-no-select");

      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const pos = (getEventX(ev) - rect.left) / barRef.current.offsetWidth;
      commit(pos);
    }

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("touchmove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("touchend", mouseUp);

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("touchmove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("touchend", mouseUp);
    };
  }, [mouseDown, barRef, commit, commitImmediately]);

  const dragMouseDown = useCallback(
    (ev: ActivityEvent) => {
      setMouseDown(true);
      document.body.setAttribute("data-no-select", "true");

      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const pos =
        ((getEventX(ev) - rect.left) / barRef.current.offsetWidth) * 100;
      setProgress(pos);
    },
    [setProgress, barRef],
  );

  return {
    dragging: mouseDown,
    dragPercentage: progress,
    dragMouseDown,
  };
}
