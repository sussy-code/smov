import { IconPatch } from "components/buttons/IconPatch";
import { Icons } from "components/Icon";
import { Loading } from "components/layout/Loading";
import { MWMediaStream } from "providers";
import { useRef } from "react";

export interface VideoPlayerProps {
  source: MWMediaStream;
  startAt?: number;
  onProgress?: (event: ProgressEvent) => void;
}

export function SkeletonVideoPlayer(props: { error?: boolean }) {
  return (
    <div className="bg-denim-200 flex aspect-video w-full items-center justify-center rounded-xl">
      {props.error ? (
        <div className="flex flex-col items-center">
          <IconPatch icon={Icons.WARNING} className="text-red-400" />
          <p className="mt-5 text-white">Couldn't get your stream</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loading />
          <p className="mt-3 text-white">Getting your stream...</p>
        </div>
      )}
    </div>
  );
}

export function VideoPlayer(props: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mustUseHls = props.source.type === "m3u8";

  return (
    <video
      className="bg-denim-500 w-full rounded-xl"
      ref={videoRef}
      onProgress={(e) =>
        props.onProgress && props.onProgress(e.nativeEvent as ProgressEvent)
      }
      onLoadedData={(e) => {
        if (props.startAt)
          (e.target as HTMLVideoElement).currentTime = props.startAt;
      }}
      controls
      autoPlay
    >
      {!mustUseHls ? <source src={props.source.url} type="video/mp4" /> : null}
    </video>
  );
}
