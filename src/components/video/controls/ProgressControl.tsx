import { useCallback, useRef } from "react";
import { useVideoPlayerState } from "../VideoContext";

export function ProgressControl() {
  const { videoState } = useVideoPlayerState();
  const ref = useRef<HTMLDivElement>(null);

  const watchProgress = `${(
    (videoState.time / videoState.duration) *
    100
  ).toFixed(2)}%`;
  const bufferProgress = `${(
    (videoState.buffered / videoState.duration) *
    100
  ).toFixed(2)}%`;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const pos = (e.pageX - rect.left) / ref.current.offsetWidth;
      videoState.setTime(pos * videoState.duration);
    },
    [videoState, ref]
  );

  return (
    <div
      ref={ref}
      className="relative m-1 my-4 h-4 w-48 overflow-hidden rounded-full border border-white bg-denim-100"
      onClick={handleClick}
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
