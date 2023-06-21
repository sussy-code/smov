import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { MWStream } from "@/backend/helpers/streams";
import {
  DetailedMeta,
  decodeTMDBId,
  getMetaFromId,
} from "@/backend/metadata/getmeta";
import {
  MWMediaType,
  MWSeasonWithEpisodeMeta,
} from "@/backend/metadata/types/mw";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { Loading } from "@/components/layout/Loading";
import { useGoBack } from "@/hooks/useGoBack";
import { useLoading } from "@/hooks/useLoading";
import { SelectedMediaData, useScrape } from "@/hooks/useScrape";
import { useWatchedItem } from "@/state/watched";
import { MetaController } from "@/video/components/controllers/MetaController";
import { ProgressListenerController } from "@/video/components/controllers/ProgressListenerController";
import { SeriesController } from "@/video/components/controllers/SeriesController";
import { SourceController } from "@/video/components/controllers/SourceController";
import { VideoPlayerHeader } from "@/video/components/parts/VideoPlayerHeader";
import { VideoPlayer } from "@/video/components/VideoPlayer";
import { VideoPlayerMeta } from "@/video/state/types";

import { MediaFetchErrorView } from "./MediaErrorView";
import { MediaScrapeLog } from "./MediaScrapeLog";
import { NotFoundMedia, NotFoundWrapper } from "../notfound/NotFoundView";

function MediaViewLoading(props: { onGoBack(): void }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <Helmet>
        <title>{t("videoPlayer.loading")}</title>
      </Helmet>
      <div className="absolute inset-x-0 top-0 px-8 py-6">
        <VideoPlayerHeader onClick={props.onGoBack} />
      </div>
      <div className="flex flex-col items-center">
        <Loading className="mb-4" />
        <p className="mb-8 text-denim-700">
          {t("videoPlayer.findingBestVideo")}
        </p>
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
  const { t } = useTranslation();

  useEffect(() => {
    if (stream) {
      props.onStream(stream);
    }
  }, [stream, props]);

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <Helmet>
        <title>{props.meta.meta.title}</title>
      </Helmet>
      <div className="absolute inset-x-0 top-0 px-8 py-6">
        <VideoPlayerHeader onClick={props.onGoBack} media={props.meta.meta} />
      </div>
      <div className="flex flex-col items-center transition-opacity duration-200">
        {pending ? (
          <>
            <Loading />
            <p className="mb-8 text-denim-700">
              {t("videoPlayer.findingBestVideo")}
            </p>
          </>
        ) : (
          <>
            <IconPatch icon={Icons.EYE_SLASH} className="mb-8 text-bink-700" />
            <p className="mb-8 text-denim-700">{t("videoPlayer.noVideos")}</p>
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
  onChangeStream: (sId: string, eId: string) => void;
}
export function MediaViewPlayer(props: MediaViewPlayerProps) {
  const goBack = useGoBack();
  const { updateProgress, watchedItem } = useWatchedItem(
    props.meta,
    props.selected.episode
  );
  const firstStartTime = useRef(watchedItem?.progress);
  useEffect(() => {
    firstStartTime.current = watchedItem?.progress;
    // only want it to change when stream changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.stream]);

  const metaProps: VideoPlayerMeta = {
    meta: props.meta,
    captions: [],
  };
  let metaSeasonData: MWSeasonWithEpisodeMeta | undefined;
  if (
    props.selected.type === MWMediaType.SERIES &&
    props.meta.meta.type === MWMediaType.SERIES
  ) {
    metaProps.episode = {
      seasonId: props.selected.season,
      episodeId: props.selected.episode,
    };
    metaProps.seasons = props.meta.meta.seasons;
    metaSeasonData = props.meta.meta.seasonData;
  }

  return (
    <div className="fixed left-0 top-0 h-[100dvh] w-screen">
      <Helmet>
        <html data-full="true" />
      </Helmet>
      <VideoPlayer includeSafeArea autoPlay onGoBack={goBack}>
        <MetaController
          data={metaProps}
          seasonData={metaSeasonData}
          linkedCaptions={props.stream.captions}
        />
        <SourceController
          source={props.stream.streamUrl}
          type={props.stream.type}
          quality={props.stream.quality}
          embedId={props.stream.embedId}
          providerId={props.stream.providerId}
          captions={props.stream.captions}
        />
        <ProgressListenerController
          startAt={firstStartTime.current}
          onProgress={updateProgress}
        />
        <SeriesController
          onSelect={(d) =>
            d.seasonId &&
            d.episodeId &&
            props.onChangeStream?.(d.seasonId, d.episodeId)
          }
        />
      </VideoPlayer>
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
      const data = decodeTMDBId(mediaParams);
      if (!data) return null;
      return getMetaFromId(data.type, data.id, seasonId);
    }
  );
  // TODO get stream from someplace that actually gets updated
  const [stream, setStream] = useState<MWStream | null>(null);

  const lastSearchValue = useRef<(string | undefined)[] | null>(null);
  useEffect(() => {
    const newValue = [params.media, params.season, params.episode];
    const lastVal = lastSearchValue.current;

    const isSame =
      lastVal?.[0] === newValue[0] &&
      (lastVal?.[1] === newValue[1] || !lastVal?.[1]) &&
      (lastVal?.[2] === newValue[2] || !lastVal?.[2]);

    lastSearchValue.current = newValue;
    if (isSame && lastVal !== null) return;

    setMeta(null);
    setStream(null);
    setSelected(null);
    exec(params.media, params.season).then((v) => {
      setMeta(v ?? null);
      setStream(null);
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
  }, [exec, history, params]);

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
    <MediaViewPlayer
      meta={meta}
      stream={stream}
      selected={selected}
      onChangeStream={(sId, eId) => {
        history.replace(
          `/media/${encodeURIComponent(params.media)}/${encodeURIComponent(
            sId
          )}/${encodeURIComponent(eId)}`
        );
      }}
    />
  );
}
