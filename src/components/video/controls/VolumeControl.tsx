import { useCallback, useRef } from "react";
import { useVideoPlayerState } from "../VideoContext";

export function VolumeControl() {
  const { videoState } = useVideoPlayerState();
  const ref = useRef<HTMLDivElement>(null);

  const percentage = `${(videoState.volume * 100).toFixed(2)}%`;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const pos = (e.pageX - rect.left) / ref.current.offsetWidth;
      videoState.setVolume(pos);
    },
    [videoState, ref]
  );

  return (
    <div
      ref={ref}
      className="relative m-1 my-4 h-4 w-48 overflow-hidden rounded-full border border-white bg-bink-300"
      onClick={handleClick}
    >
      <div
        className="absolute inset-y-0 left-0 bg-bink-700"
        style={{
          width: percentage,
        }}
      />
    </div>
  );
}
