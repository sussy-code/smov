import { RefObject } from "react";

import { Icon, Icons } from "@/components/Icon";
import { formatSeconds } from "@/utils/formatSeconds";
import { SCALE_FACTOR } from "@/utils/thumbnailCreator";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { VideoProgressEvent } from "@/video/state/logic/progress";
import { useSource } from "@/video/state/logic/source";

const THUMBNAIL_HEIGHT = 100;
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
  const videoEl = document.getElementsByTagName("video")[0];
  const aspectRatio = videoEl.videoWidth / videoEl.videoHeight;
  const rect = parentRef.current.getBoundingClientRect();
  if (!rect.width) return null;
  const hoverPercent = (hoverPosition - rect.left) / rect.width;
  const hoverTime = videoTime.duration * hoverPercent;

  const thumbnailWidth = THUMBNAIL_HEIGHT * aspectRatio;
  const pos = () => {
    const relativePosition = hoverPosition - rect.left;
    if (relativePosition <= thumbnailWidth / 2) {
      return rect.left;
    }
    if (relativePosition >= rect.width - thumbnailWidth / 2) {
      return rect.width + rect.left - thumbnailWidth;
    }
    return relativePosition + rect.left - thumbnailWidth / 2;
  };
  const src = source.source?.thumbnails.find(
    (x) => x.from < hoverTime && x.to > hoverTime
  )?.imgUrl;
  return (
    <div className="text-center">
      {!src ? (
        <div
          style={{
            left: `${pos()}px`,
            width: `${thumbnailWidth}px`,
            height: `${THUMBNAIL_HEIGHT}px`,
          }}
          className="absolute bottom-32 flex items-center justify-center rounded bg-black"
        >
          <Icon
            className="roll-infinite text-6xl text-bink-600"
            icon={Icons.MOVIE_WEB}
          />
        </div>
      ) : (
        <img
          height={THUMBNAIL_HEIGHT}
          width={thumbnailWidth}
          style={{
            left: `${pos()}px`,
          }}
          className="absolute bottom-32 rounded"
          src={src}
        />
      )}
      <div
        style={{
          left: `${pos() + thumbnailWidth / 2 - 18}px`,
        }}
        className="absolute bottom-24 text-white"
      >
        {formatSeconds(hoverTime, videoEl.duration > 60 * 60)}
      </div>
    </div>
  );
}
