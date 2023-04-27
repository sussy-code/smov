import { useCallback, useEffect, useRef, useState } from "react";

import { Icon, Icons } from "@/components/Icon";
import {
  makePercentage,
  makePercentageString,
  useProgressBar,
} from "@/hooks/useProgressBar";
import { useVolumeControl } from "@/hooks/useVolumeToggle";
import { canChangeVolume } from "@/utils/detectFeatures";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useInterface } from "@/video/state/logic/interface";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";

interface Props {
  className?: string;
}

export function VolumeAction(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const mediaPlaying = useMediaPlaying(descriptor);
  const videoInterface = useInterface(descriptor);
  const { setStoredVolume, toggleVolume } = useVolumeControl(descriptor);
  const ref = useRef<HTMLDivElement>(null);
  const [hoveredOnce, setHoveredOnce] = useState(false);

  const commitVolume = useCallback(
    (percentage) => {
      controls.setVolume(percentage);
      setStoredVolume(percentage);
    },
    [controls, setStoredVolume]
  );
  const { dragging, dragPercentage, dragMouseDown } = useProgressBar(
    ref,
    commitVolume,
    true
  );

  useEffect(() => {
    if (!videoInterface.leftControlHovering) setHoveredOnce(false);
  }, [videoInterface]);

  const handleClick = useCallback(() => {
    toggleVolume();
  }, [toggleVolume]);

  const handleMouseEnter = useCallback(async () => {
    if (await canChangeVolume()) setHoveredOnce(true);
  }, [setHoveredOnce]);

  let percentage = makePercentage(mediaPlaying.volume * 100);
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
            onTouchStart={dragMouseDown}
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
