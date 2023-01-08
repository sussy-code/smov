import { useCallback, useEffect, useRef, useState } from "react";
import { useVideoPlayerState } from "../VideoContext";

export function ProgressControl() {
  const { videoState } = useVideoPlayerState();
  const ref = useRef<HTMLDivElement>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  let watchProgress = `${(
    (videoState.time / videoState.duration) *
    100
  ).toFixed(2)}%`;
  if (mouseDown) watchProgress = `${progress}%`;

  const bufferProgress = `${(
    (videoState.buffered / videoState.duration) *
    100
  ).toFixed(2)}%`;

  useEffect(() => {
    function mouseMove(ev: MouseEvent) {
      if (!mouseDown || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const pos = ((ev.pageX - rect.left) / ref.current.offsetWidth) * 100;
      setProgress(pos);
    }

    function mouseUp(ev: MouseEvent) {
      if (!mouseDown) return;
      setMouseDown(false);
      document.body.removeAttribute("data-no-select");

      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const pos = (ev.pageX - rect.left) / ref.current.offsetWidth;
      videoState.setTime(pos * videoState.duration);
    }

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };
  }, [mouseDown, videoState]);

  const handleMouseDown = useCallback(() => {
    setMouseDown(true);
    document.body.setAttribute("data-no-select", "true");
  }, []);

  return (
    <div
      ref={ref}
      className="relative m-1 my-4 h-4 w-48 overflow-hidden rounded-full border border-white bg-denim-100"
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute inset-y-0 left-0 bg-denim-700 opacity-50"
        style={{
          width: bufferProgress,
        }}
      />
      <div
        className="absolute inset-y-0 left-0 bg-denim-700"
        style={{
          width: watchProgress,
        }}
      />
    </div>
  );
}
