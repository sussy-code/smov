import { Icon, Icons } from "@/components/Icon";
import {
  makePercentage,
  makePercentageString,
  useProgressBar,
} from "@/hooks/useProgressBar";
import { canChangeVolume } from "@/utils/detectFeatures";
import { useCallback, useEffect, useRef, useState } from "react";
import { useVideoPlayerState } from "../VideoContext";

interface Props {
  className?: string;
}

export function VolumeControl(props: Props) {
  const { videoState } = useVideoPlayerState();
  const ref = useRef<HTMLDivElement>(null);
  const [storedVolume, setStoredVolume] = useState(1);
  const [hoveredOnce, setHoveredOnce] = useState(false);

  const commitVolume = useCallback(
    (percentage) => {
      videoState.setVolume(percentage);
      setStoredVolume(percentage);
    },
    [videoState, setStoredVolume]
  );
  const { dragging, dragPercentage, dragMouseDown } = useProgressBar(
    ref,
    commitVolume,
    true
  );

  useEffect(() => {
    if (!videoState.leftControlHovering) setHoveredOnce(false);
  }, [videoState, setHoveredOnce]);

  const handleClick = useCallback(() => {
    if (videoState.volume > 0) {
      videoState.setVolume(0);
      setStoredVolume(videoState.volume);
    } else {
      videoState.setVolume(storedVolume > 0 ? storedVolume : 1);
    }
  }, [videoState, setStoredVolume, storedVolume]);

  const handleMouseEnter = useCallback(async () => {
    if (await canChangeVolume()) setHoveredOnce(true);
  }, [setHoveredOnce]);

  let percentage = makePercentage(videoState.volume * 100);
  if (dragging) percentage = makePercentage(dragPercentage);
  const percentageString = makePercentageString(percentage);

  return (
    <div className={props.className}>
      <div
        className="pointer-events-auto flex cursor-pointer items-center"
        onMouseEnter={handleMouseEnter}
      >
        <div className="px-4 text-2xl text-white" onClick={handleClick}>
          <Icon icon={percentage > 0 ? Icons.VOLUME : Icons.VOLUME_X} />
        </div>
        <div
          className={`linear -ml-2 w-0 overflow-hidden transition-[width,opacity] duration-300 ${
            hoveredOnce || dragging ? "!w-24 opacity-100" : "w-4 opacity-0"
          }`}
        >
          <div
            ref={ref}
            className="flex h-10 w-20 items-center px-2"
            onMouseDown={dragMouseDown}
          >
            <div className="relative h-1 flex-1 rounded-full bg-gray-500 bg-opacity-50">
              <div
                className="absolute inset-y-0 left-0 flex items-center justify-end rounded-full bg-bink-500"
                style={{
                  width: percentageString,
                }}
              >
                <div className="absolute h-3 w-3 translate-x-1/2 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
