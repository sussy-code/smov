import { useHistory, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { DecoratedVideoPlayer } from "@/components/video/DecoratedVideoPlayer";
import { MWStream } from "@/backend/helpers/streams";
import { useScrape } from "@/hooks/useScrape";
import { VideoPlayerHeader } from "@/components/video/parts/VideoPlayerHeader";
import { DetailedMeta, getMetaFromId } from "@/backend/metadata/getmeta";
import { JWMediaToMediaType } from "@/backend/metadata/justwatch";
import { SourceControl } from "@/components/video/controls/SourceControl";

function MediaViewLoading() {
  return <p>Loading meta...</p>;
}

interface MediaViewScrapingProps {
  onStream(stream: MWStream): void;
  onGoBack(): void;
  meta: DetailedMeta;
}
function MediaViewScraping(props: MediaViewScrapingProps) {
  const { eventLog, pending, stream } = useScrape(props.meta);

  useEffect(() => {
    if (stream) {
      props.onStream(stream);
    }
  }, [stream, props]);

  return (
    <div>
      <VideoPlayerHeader
        onClick={props.onGoBack}
        title={props.meta.meta.title}
      />
      <p>pending: {pending.toString()}</p>
      <p>
        stream: {stream?.streamUrl} - {stream?.type} - {stream?.quality}
      </p>
      <hr />
      {eventLog.map((v) => (
        <div className="rounded-xl p-1 text-white">
          <p>
            {v.percentage}% - {v.type} - {v.errored ? "ERROR" : "pending"}
          </p>
        </div>
      ))}
    </div>
  );
}

export function MediaView() {
  const reactHistory = useHistory();
  const params = useParams<{ media: string }>();
  const goBack = useCallback(() => {
    if (reactHistory.action !== "POP") reactHistory.goBack();
    else reactHistory.push("/");
  }, [reactHistory]);

  const [meta, setMeta] = useState<DetailedMeta | null>(null);
  const [stream, setStream] = useState<MWStream | null>(null);

  useEffect(() => {
    (async () => {
      const [t, id] = params.media.split("-", 2);
      const type = JWMediaToMediaType(t);
      const fetchedMeta = await getMetaFromId(type, id);
      setMeta(fetchedMeta);
    })();
  }, [setMeta, params]);

  // TODO not found checks
  // TODO watched store
  // TODO scrape loading state
  // TODO error page with video header

  if (!meta) return <MediaViewLoading />;
  if (!stream)
    return (
      <MediaViewScraping meta={meta} onGoBack={goBack} onStream={setStream} />
    );
  return (
    <div className="h-screen w-screen">
      <DecoratedVideoPlayer title={meta.meta.title} onGoBack={goBack} autoPlay>
        <SourceControl source={stream.streamUrl} type={stream.type} />
      </DecoratedVideoPlayer>
    </div>
  );
}
