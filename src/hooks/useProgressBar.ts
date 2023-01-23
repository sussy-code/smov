import React, { RefObject, useCallback, useEffect, useState } from "react";

type ActivityEvent =
  | React.MouseEvent<HTMLElement>
  | React.TouchEvent<HTMLElement>;

export function makePercentageString(num: number) {
  return `${num.toFixed(2)}%`;
}

export function makePercentage(num: number) {
  return Number(Math.max(0, Math.min(num, 100)).toFixed(2));
}

function isClickEvent(
  evt: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
): evt is React.MouseEvent<HTMLElement> {
  return evt.type === "mousedown";
}

const getEventX = (
  evt: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
) => {
  return isClickEvent(evt) ? evt.pageX : evt.touches[0].pageX;
};

export function useProgressBar(
  barRef: RefObject<HTMLElement>,
  commit: (percentage: number) => void,
  commitImmediately = false
) {
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    function mouseMove(ev: MouseEvent) {
      if (!mouseDown || !barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const pos = (ev.pageX - rect.left) / barRef.current.offsetWidth;
      setProgress(pos * 100);
      if (commitImmediately) commit(pos);
    }

    function mouseUp(ev: MouseEvent | TouchEvent) {
      if (!mouseDown) return;
      setMouseDown(false);
      document.body.removeAttribute("data-no-select");

      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const pos = (getEventX(ev) - rect.left) / barRef.current.offsetWidth;
      commit(pos);
    }

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("touchend", mouseUp);

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };
  }, [mouseDown, barRef, commit, commitImmediately]);

  const dragMouseDown = useCallback(
    (ev: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
      setMouseDown(true);
      document.body.setAttribute("data-no-select", "true");

      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const pos =
        ((getEventX(ev) - rect.left) / barRef.current.offsetWidth) * 100;
      setProgress(pos);
    },
    [setProgress, barRef]
  );

  return {
    dragging: mouseDown,
    dragPercentage: progress,
    dragMouseDown,
  };
}
