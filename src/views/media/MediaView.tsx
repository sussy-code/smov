import { useHistory, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { DecoratedVideoPlayer } from "@/components/video/DecoratedVideoPlayer";
import { MWStream } from "@/backend/helpers/streams";
import { useScrape } from "@/hooks/useScrape";
import { VideoPlayerHeader } from "@/components/video/parts/VideoPlayerHeader";
import { DetailedMeta, getMetaFromId } from "@/backend/metadata/getmeta";
import { JWMediaToMediaType } from "@/backend/metadata/justwatch";
import { SourceControl } from "@/components/video/controls/SourceControl";
import { Loading } from "@/components/layout/Loading";
import { MediaScrapeLog } from "./MediaScrapeLog";

function MediaViewLoading(props: { onGoBack(): void }) {
  return (
    <div className="relative flex h-screen items-center justify-center">
      <div className="absolute inset-x-0 top-0 p-6">
        <VideoPlayerHeader onClick={props.onGoBack} />
      </div>
      <div className="flex flex-col items-center">
        <Loading className="mb-4" />
        <p className="mb-8 text-denim-700">Finding the best video for you</p>
      </div>
    </div>
  );
}

interface MediaViewScrapingProps {
  onStream(stream: MWStream): void;
  onGoBack(): void;
  meta: DetailedMeta;
}
function MediaViewScraping(props: MediaViewScrapingProps) {
  const { eventLog, stream } = useScrape(props.meta);

  useEffect(() => {
    if (stream) {
      props.onStream(stream);
    }
  }, [stream, props]);

  // TODO error screen if no streams found

  return (
    <div className="relative flex h-screen items-center justify-center">
      <div className="absolute inset-x-0 top-0 py-6 px-8">
        <VideoPlayerHeader
          onClick={props.onGoBack}
          title={props.meta.meta.title}
        />
      </div>
      <div className="flex flex-col items-center">
        <Loading className="mb-4" />
        <p className="mb-8 text-denim-700">Finding the best video for you</p>
        <MediaScrapeLog events={eventLog} />
      </div>
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
    // TODO handle errors
    (async () => {
      const [t, id] = params.media.split("-", 2);
      const type = JWMediaToMediaType(t);
      const fetchedMeta = await getMetaFromId(type, id);
      setMeta(fetchedMeta);
    })();
  }, [setMeta, params]);

  // TODO watched store
  // TODO error page with video header

  if (!meta) return <MediaViewLoading onGoBack={goBack} />;
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
