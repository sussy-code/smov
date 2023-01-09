import React, { RefObject, useCallback, useEffect, useState } from "react";

export function makePercentageString(num: number) {
  return `${num.toFixed(2)}%`;
}

export function makePercentage(num: number) {
  return Number(Math.max(0, Math.min(num, 100)).toFixed(2));
}

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
      const pos = ((ev.pageX - rect.left) / barRef.current.offsetWidth) * 100;
      setProgress(pos);
      if (commitImmediately) commit(pos);
    }

    function mouseUp(ev: MouseEvent) {
      if (!mouseDown) return;
      setMouseDown(false);
      document.body.removeAttribute("data-no-select");

      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const pos = (ev.pageX - rect.left) / barRef.current.offsetWidth;
      commit(pos);
    }

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };
  }, [mouseDown, barRef, commit, commitImmediately]);

  const dragMouseDown = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      setMouseDown(true);
      document.body.setAttribute("data-no-select", "true");

      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const pos = ((ev.pageX - rect.left) / barRef.current.offsetWidth) * 100;
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
