import { IconPatch } from "components/buttons/IconPatch";
import { Icons } from "components/Icon";
import { Loading } from "components/layout/Loading";
import { MWMediaCaption, MWMediaStream } from "providers";
import { ReactElement, useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export interface VideoPlayerProps {
  source: MWMediaStream;
  captions: MWMediaCaption[];
  startAt?: number;
  onProgress?: (event: ProgressEvent) => void;
}

export function SkeletonVideoPlayer(props: { error?: boolean }) {
  return (
    <div className="bg-denim-200 flex aspect-video w-full items-center justify-center rounded-xl">
      {props.error ? (
        <div className="flex flex-col items-center">
          <IconPatch icon={Icons.WARNING} className="text-red-400" />
          <p className="mt-5 text-white">Couldn&apos;t get your stream</p>
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
  const [hasErrored, setErrored] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const showVideo = !isLoading && !hasErrored;
  const mustUseHls = props.source.type === "m3u8";

  // reset if stream url changes
  useEffect(() => {
    setLoading(true);
    setErrored(false);

    // hls support
    if (mustUseHls) {
      if (!videoRef.current)
        return;

      if (!Hls.isSupported()) {
        setLoading(false);
        setErrored(true);
        return;
      }

      const hls = new Hls();

      if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = props.source.url;
        return;
      }

      hls.attachMedia(videoRef.current);
      hls.loadSource(props.source.url);

      hls.on(Hls.Events.ERROR, (event, data) => {
        setErrored(true);
        console.error(data);
      });
    }
  }, [props.source.url, videoRef, mustUseHls]);

  let skeletonUi: null | ReactElement = null;
  if (hasErrored) {
    skeletonUi = <SkeletonVideoPlayer error />;
  } else if (isLoading) {
    skeletonUi = <SkeletonVideoPlayer />;
  }

  return (
    <>
      {skeletonUi}
      <video
        className={`bg-denim-500 w-full rounded-xl ${!showVideo ? "hidden" : ""
          }`}
        ref={videoRef}
        onProgress={(e) =>
          props.onProgress && props.onProgress(e.nativeEvent as ProgressEvent)
        }
        onLoadedData={(e) => {
          setLoading(false);
          if (props.startAt)
            (e.target as HTMLVideoElement).currentTime = props.startAt;
        }}
        onError={(e) => {
          console.error("failed to playback stream", e);
          setErrored(true);
        }}
        controls
        autoPlay
      >
        {!mustUseHls ? (
          <source src={props.source.url} type="video/mp4" />
        ) : null}
        {props.captions.map((v) => (
          <track key={v.id} kind="captions" label={v.label} src={v.url} />
        ))}
      </video>
    </>
  );
}
