import { RefObject } from "react";

import { formatSeconds } from "@/utils/formatSeconds";
import { SCALE_FACTOR } from "@/utils/thumbnailCreator";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { VideoProgressEvent } from "@/video/state/logic/progress";
import { useSource } from "@/video/state/logic/source";

export default function ThumbnailAction({
  parentRef,
  hoverPosition,
  videoTime,
}: {
  parentRef: RefObject<HTMLDivElement>;
  hoverPosition: number;
  videoTime: VideoProgressEvent;
}) {
  const descriptor = useVideoPlayerDescriptor();
  const source = useSource(descriptor);
  if (!parentRef.current) return null;
  const offset =
    (document.getElementsByTagName("video")[0].videoWidth * SCALE_FACTOR) / 2;
  const rect = parentRef.current.getBoundingClientRect();

  const hoverPercent = (hoverPosition - rect.left) / rect.width;
  const hoverTime = videoTime.duration * hoverPercent;

  const pos = () => {
    const relativePosition = hoverPosition - rect.left;
    if (relativePosition <= offset) {
      return 0;
    }
    if (relativePosition >= rect.width - offset) {
      return rect.width - offset * 2;
    }
    return relativePosition - offset;
  };

  return (
    <div>
      <img
        style={{
          left: `${pos()}px`,
        }}
        className="absolute bottom-10 rounded"
        src={
          source.source?.thumbnails.find(
            (x) => x.from < hoverTime && x.to > hoverTime
          )?.imgUrl
        }
      />
      <div
        style={{
          left: `${pos() + offset - 18}px`,
        }}
        className="absolute bottom-3 text-white"
      >
        {formatSeconds(hoverTime)}
      </div>
    </div>
  );
}
