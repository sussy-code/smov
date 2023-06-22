import { RefObject, useMemo } from "react";

import { Icon, Icons } from "@/components/Icon";
import { formatSeconds } from "@/utils/formatSeconds";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { VideoProgressEvent } from "@/video/state/logic/progress";
import { useSource } from "@/video/state/logic/source";

const THUMBNAIL_HEIGHT = 100;
function position(
  rectLeft: number,
  rectWidth: number,
  thumbnailWidth: number,
  hoverPos: number
): number {
  const relativePosition = hoverPos - rectLeft;
  if (relativePosition <= thumbnailWidth / 2) {
    return rectLeft;
  }
  if (relativePosition >= rectWidth - thumbnailWidth / 2) {
    return rectWidth + rectLeft - thumbnailWidth;
  }
  return relativePosition + rectLeft - thumbnailWidth / 2;
}
function useThumbnailWidth() {
  const videoEl = useMemo(() => document.getElementsByTagName("video")[0], []);
  const aspectRatio = videoEl.videoWidth / videoEl.videoHeight;
  return THUMBNAIL_HEIGHT * aspectRatio;
}

function LoadingThumbnail({ pos }: { pos: number }) {
  const videoEl = useMemo(() => document.getElementsByTagName("video")[0], []);
  const aspectRatio = videoEl.videoWidth / videoEl.videoHeight;
  const thumbnailWidth = THUMBNAIL_HEIGHT * aspectRatio;
  return (
    <div
      className="absolute bottom-32 flex items-center justify-center rounded bg-black"
      style={{
        left: `${pos}px`,
        width: `${thumbnailWidth}px`,
        height: `${THUMBNAIL_HEIGHT}px`,
      }}
    >
      <Icon
        className="roll-infinite text-6xl text-bink-600"
        icon={Icons.MOVIE_WEB}
      />
    </div>
  );
}

function ThumbnailTime({ hoverTime, pos }: { hoverTime: number; pos: number }) {
  const videoEl = useMemo(() => document.getElementsByTagName("video")[0], []);
  const thumbnailWidth = useThumbnailWidth();
  return (
    <div
      className="absolute bottom-24 text-white"
      style={{
        left: `${pos + thumbnailWidth / 2 - 18}px`,
      }}
    >
      {formatSeconds(hoverTime, videoEl.duration > 60 * 60)}
    </div>
  );
}

function ThumbnailImage({ src, pos }: { src: string; pos: number }) {
  const thumbnailWidth = useThumbnailWidth();
  return (
    <img
      height={THUMBNAIL_HEIGHT}
      width={thumbnailWidth}
      className="absolute bottom-32 rounded"
      src={src}
      style={{
        left: `${pos}px`,
      }}
    />
  );
}
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
  const thumbnailWidth = useThumbnailWidth();
  if (!parentRef.current) return null;
  const rect = parentRef.current.getBoundingClientRect();
  if (!rect.width) return null;

  const hoverPercent = (hoverPosition - rect.left) / rect.width;
  const hoverTime = videoTime.duration * hoverPercent;
  const src = source.source?.thumbnails.find(
    (x) => x.from < hoverTime && x.to > hoverTime
  )?.imgUrl;
  return (
    <div className="pointer-events-none">
      {!src ? (
        <LoadingThumbnail
          pos={position(rect.left, rect.width, thumbnailWidth, hoverPosition)}
        />
      ) : (
        <ThumbnailImage
          pos={position(rect.left, rect.width, thumbnailWidth, hoverPosition)}
          src={src}
        />
      )}
      <ThumbnailTime
        hoverTime={hoverTime}
        pos={position(rect.left, rect.width, thumbnailWidth, hoverPosition)}
      />
    </div>
  );
}
