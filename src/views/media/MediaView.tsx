import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DecoratedVideoPlayer } from "@/components/video/DecoratedVideoPlayer";
import { MWStream } from "@/backend/helpers/streams";
import { SelectedMediaData, useScrape } from "@/hooks/useScrape";
import { VideoPlayerHeader } from "@/components/video/parts/VideoPlayerHeader";
import { DetailedMeta, getMetaFromId } from "@/backend/metadata/getmeta";
import { JWMediaToMediaType } from "@/backend/metadata/justwatch";
import { SourceControl } from "@/components/video/controls/SourceControl";
import { Loading } from "@/components/layout/Loading";
import { useLoading } from "@/hooks/useLoading";
import { MWMediaType } from "@/backend/metadata/types";
import { useGoBack } from "@/hooks/useGoBack";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { useWatchedItem } from "@/state/watched";
import { ProgressListenerControl } from "@/components/video/controls/ProgressListenerControl";
import { MediaFetchErrorView } from "./MediaErrorView";
import { MediaScrapeLog } from "./MediaScrapeLog";
import { NotFoundMedia, NotFoundWrapper } from "../notfound/NotFoundView";

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
  selected: SelectedMediaData;
}
function MediaViewScraping(props: MediaViewScrapingProps) {
  const { eventLog, stream, pending } = useScrape(props.meta, props.selected);

  useEffect(() => {
    if (stream) {
      props.onStream(stream);
    }
  }, [stream, props]);

  return (
    <div className="relative flex h-screen items-center justify-center">
      <div className="absolute inset-x-0 top-0 py-6 px-8">
        <VideoPlayerHeader onClick={props.onGoBack} media={props.meta.meta} />
      </div>
      <div className="flex flex-col items-center transition-opacity duration-200">
        {pending ? (
          <>
            <Loading />
            <p className="mb-8 text-denim-700">
              Finding the best video for you
            </p>
          </>
        ) : (
          <>
            <IconPatch icon={Icons.EYE_SLASH} className="mb-8 text-bink-700" />
            <p className="mb-8 text-denim-700">
              Whoops, could&apos;t find any videos for you
            </p>
          </>
        )}
        <div
          className={`flex flex-col items-center transition-opacity duration-200 ${
            pending ? "opacity-100" : "opacity-0"
          }`}
        >
          <MediaScrapeLog events={eventLog} />
        </div>
      </div>
    </div>
  );
}

export function MediaView() {
  const params = useParams<{ media: string }>();
  const goBack = useGoBack();

  const [meta, setMeta] = useState<DetailedMeta | null>(null);
  const [selected, setSelected] = useState<SelectedMediaData | null>(null);
  const [exec, loading, error] = useLoading(async (mediaParams: string) => {
    let type: MWMediaType;
    let id = "";
    try {
      const [t, i] = mediaParams.split("-", 2);
      type = JWMediaToMediaType(t);
      id = i;
    } catch (err) {
      return null;
    }
    return getMetaFromId(type, id);
  });
  const [stream, setStream] = useState<MWStream | null>(null);

  const { updateProgress, watchedItem } = useWatchedItem(meta);

  useEffect(() => {
    exec(params.media).then((v) => {
      setMeta(v ?? null);
      if (v)
        setSelected({
          type: v.meta.type,
          episode: 0 as any,
          season: 0 as any,
        });
      else setSelected(null);
    });
  }, [exec, params.media]);

  if (loading) return <MediaViewLoading onGoBack={goBack} />;
  if (error) return <MediaFetchErrorView />;
  if (!meta || !selected)
    return (
      <NotFoundWrapper video>
        <NotFoundMedia />
      </NotFoundWrapper>
    );

  // scraping view will start scraping and return with onStream
  if (!stream)
    return (
      <MediaViewScraping
        meta={meta}
        selected={selected}
        onGoBack={goBack}
        onStream={setStream}
      />
    );

  // show stream once we have a stream
  return (
    <div className="h-screen w-screen">
      <DecoratedVideoPlayer media={meta.meta} onGoBack={goBack} autoPlay>
        <SourceControl source={stream.streamUrl} type={stream.type} />
        <ProgressListenerControl
          startAt={watchedItem?.progress}
          onProgress={updateProgress}
        />
      </DecoratedVideoPlayer>
    </div>
  );
}
