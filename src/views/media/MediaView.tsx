import { useHistory, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useEffect, useRef, useState } from "react";
import { DecoratedVideoPlayer } from "@/components/video/DecoratedVideoPlayer";
import { MWStream } from "@/backend/helpers/streams";
import { SelectedMediaData, useScrape } from "@/hooks/useScrape";
import { VideoPlayerHeader } from "@/components/video/parts/VideoPlayerHeader";
import { DetailedMeta, getMetaFromId } from "@/backend/metadata/getmeta";
import { decodeJWId } from "@/backend/metadata/justwatch";
import { SourceControl } from "@/components/video/controls/SourceControl";
import { Loading } from "@/components/layout/Loading";
import { useLoading } from "@/hooks/useLoading";
import { MWMediaType } from "@/backend/metadata/types";
import { useGoBack } from "@/hooks/useGoBack";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { useWatchedItem } from "@/state/watched";
import { ProgressListenerControl } from "@/components/video/controls/ProgressListenerControl";
import { ShowControl } from "@/components/video/controls/ShowControl";
import { MediaFetchErrorView } from "./MediaErrorView";
import { MediaScrapeLog } from "./MediaScrapeLog";
import { NotFoundMedia, NotFoundWrapper } from "../notfound/NotFoundView";

function MediaViewLoading(props: { onGoBack(): void }) {
  return (
    <div className="relative flex h-screen items-center justify-center">
      <Helmet>
        <title>Loading...</title>
      </Helmet>
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
      <Helmet>
        <title>{props.meta.meta.title}</title>
      </Helmet>
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

interface MediaViewPlayerProps {
  meta: DetailedMeta;
  stream: MWStream;
  selected: SelectedMediaData;
}
export function MediaViewPlayer(props: MediaViewPlayerProps) {
  const goBack = useGoBack();
  const { updateProgress, watchedItem } = useWatchedItem(props.meta);
  const firstStartTime = useRef(watchedItem?.progress);
  useEffect(() => {
    firstStartTime.current = watchedItem?.progress;
    // only want it to change when stream changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.stream]);

  // TODO show episode title

  return (
    <div className="h-screen w-screen">
      <Helmet>
        <title>{props.meta.meta.title}</title>
      </Helmet>
      <DecoratedVideoPlayer media={props.meta.meta} onGoBack={goBack} autoPlay>
        <SourceControl
          source={props.stream.streamUrl}
          type={props.stream.type}
        />
        <ProgressListenerControl
          startAt={firstStartTime.current}
          onProgress={updateProgress}
        />
        {props.selected.type === MWMediaType.SERIES ? (
          <ShowControl
            series={{
              seasonId: props.selected.season,
              episodeId: props.selected.episode,
            }}
            onSelect={(d) => console.log("selected stuff", d)}
          />
        ) : null}
      </DecoratedVideoPlayer>
    </div>
  );
}

export function MediaView() {
  const params = useParams<{
    media: string;
    episode?: string;
    season?: string;
  }>();
  const goBack = useGoBack();
  const history = useHistory();

  const [meta, setMeta] = useState<DetailedMeta | null>(null);
  const [selected, setSelected] = useState<SelectedMediaData | null>(null);
  const [exec, loading, error] = useLoading(
    async (mediaParams: string, seasonId?: string) => {
      const data = decodeJWId(mediaParams);
      if (!data) return null;
      return getMetaFromId(data.type, data.id, seasonId);
    }
  );
  const [stream, setStream] = useState<MWStream | null>(null);

  useEffect(() => {
    exec(params.media, params.season).then((v) => {
      setMeta(v ?? null);
      if (v) {
        if (v.meta.type !== MWMediaType.SERIES) {
          setSelected({
            type: v.meta.type,
            season: undefined,
            episode: undefined,
          });
        } else {
          const season = params.season ?? v.meta.seasonData.id;
          const episode = params.episode ?? v.meta.seasonData.episodes[0].id;
          setSelected({
            type: MWMediaType.SERIES,
            season,
            episode,
          });
          if (season !== params.season || episode !== params.episode)
            history.replace(
              `/media/${encodeURIComponent(params.media)}/${encodeURIComponent(
                season
              )}/${encodeURIComponent(episode)}`
            );
        }
      } else setSelected(null);
    });
    // dont rerender when params changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exec, history]);

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
  return <MediaViewPlayer meta={meta} stream={stream} selected={selected} />;
}
