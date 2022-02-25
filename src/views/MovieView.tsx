import { VideoPlayer } from "components/media/VideoPlayer";
import { usePortableMedia } from "hooks/usePortableMedia";
import { MWPortableMedia, getStream, MWMediaStream } from "providers";
import { useEffect, useState } from "react";
import { useWatchedContext } from "state/watched";

export function MovieView() {
  const mediaPortable: MWPortableMedia | undefined = usePortableMedia();
  const [streamUrl, setStreamUrl] = useState<MWMediaStream | undefined>();
  const store = useWatchedContext();

  useEffect(() => {
    (async () => {
      setStreamUrl(mediaPortable && (await getStream(mediaPortable)));
    })();
  }, [mediaPortable, setStreamUrl]);

  function updateProgress(e: Event) {
    if (!mediaPortable) return;
    const el: HTMLVideoElement = e.currentTarget as HTMLVideoElement;
    store.updateProgress(mediaPortable, el.currentTime, el.duration);
  }

  return (
    <div>
      <p>Movie view here</p>
      <p>{JSON.stringify(mediaPortable, null, 2)}</p>
      <p></p>
      {streamUrl ? (
        <VideoPlayer source={streamUrl} onProgress={updateProgress} />
      ) : null}
    </div>
  );
}
