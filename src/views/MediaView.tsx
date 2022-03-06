import { IconPatch } from "components/buttons/IconPatch";
import { Icons } from "components/Icon";
import { Navigation } from "components/layout/Navigation";
import { Paper } from "components/layout/Paper";
import { SkeletonVideoPlayer, VideoPlayer } from "components/media/VideoPlayer";
import { ArrowLink } from "components/text/ArrowLink";
import { DotList } from "components/text/DotList";
import { Title } from "components/text/Title";
import { useLoading } from "hooks/useLoading";
import { usePortableMedia } from "hooks/usePortableMedia";
import {
  MWPortableMedia,
  getStream,
  MWMediaStream,
  MWMedia,
  convertPortableToMedia,
  getProviderFromId,
  MWMediaProvider,
} from "providers";
import { ReactNode, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  getIfBookmarkedFromPortable,
  useBookmarkContext,
} from "state/bookmark";
import { getWatchedFromPortable, useWatchedContext } from "state/watched";
import { NotFoundChecks } from "./notfound/NotFoundChecks";

interface StyledMediaViewProps {
  media: MWMedia;
  stream: MWMediaStream;
  provider: MWMediaProvider;
}

function StyledMediaView(props: StyledMediaViewProps) {
  const watchedStore = useWatchedContext();
  const startAtTime: number | undefined = getWatchedFromPortable(
    watchedStore.watched.items,
    props.media
  )?.progress;
  const { setItemBookmark, getFilteredBookmarks } = useBookmarkContext();
  const isBookmarked = getIfBookmarkedFromPortable(
    getFilteredBookmarks(),
    props.media
  );

  function updateProgress(e: Event) {
    if (!props.media) return;
    const el: HTMLVideoElement = e.currentTarget as HTMLVideoElement;
    if (el.currentTime <= 30) {
      return; // Don't update stored progress if less than 30s into the video
    }
    watchedStore.updateProgress(props.media, el.currentTime, el.duration);
  }

  return (
    <>
      <VideoPlayer
        source={props.stream}
        onProgress={updateProgress}
        startAt={startAtTime}
      />
      <Paper className="mt-5">
        <div className="flex">
          <div className="flex-1">
            <Title>{props.media.title}</Title>
            <DotList
              className="mt-3 text-sm"
              content={[
                props.provider.displayName,
                props.media.mediaType,
                props.media.year,
              ]}
            />
          </div>
          <div>
            <IconPatch
              icon={Icons.BOOKMARK}
              active={isBookmarked}
              onClick={() => setItemBookmark(props.media, !isBookmarked)}
              clickable
            />
          </div>
        </div>
      </Paper>
    </>
  );
}

function LoadingMediaView(props: { error?: boolean }) {
  return (
    <>
      <SkeletonVideoPlayer error={props.error} />
      <Paper className="mt-5">
        <div className="flex">
          <div className="flex-1">
            <div className="bg-denim-500 mb-2 h-4 w-48 rounded-full" />
            <div>
              <span className="bg-denim-400 mr-4 inline-block h-2 w-12 rounded-full" />
              <span className="bg-denim-400 mr-4 inline-block h-2 w-12 rounded-full" />
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
}

function MediaViewContent(props: { portable: MWPortableMedia }) {
  const mediaPortable = props.portable;
  const [streamUrl, setStreamUrl] = useState<MWMediaStream | undefined>();
  const [media, setMedia] = useState<MWMedia | undefined>();
  const [fetchAllData, loading, error] = useLoading((mediaPortable) => {
    const streamPromise = getStream(mediaPortable);
    const mediaPromise = convertPortableToMedia(mediaPortable);
    return Promise.all([streamPromise, mediaPromise]);
  });

  useEffect(() => {
    (async () => {
      if (mediaPortable) {
        const resultData = await fetchAllData(mediaPortable);
        if (!resultData) return;
        setStreamUrl(resultData[0]);
        setMedia(resultData[1]);
      }
    })();
  }, [mediaPortable, setStreamUrl, fetchAllData]);

  let content: ReactNode;
  if (loading) content = <LoadingMediaView />;
  else if (error) content = <LoadingMediaView error />;
  else if (mediaPortable && media && streamUrl)
    content = (
      <StyledMediaView
        provider={
          getProviderFromId(mediaPortable.providerId) as MWMediaProvider
        }
        media={media}
        stream={streamUrl}
      />
    );

  return <>{content}</>;
}

export function MediaView() {
  const mediaPortable: MWPortableMedia | undefined = usePortableMedia();
  const reactHistory = useHistory();

  return (
    <div className="flex min-h-screen w-full">
      <Navigation>
        <ArrowLink
          onClick={() => {
            reactHistory.action !== "POP"
              ? reactHistory.goBack()
              : reactHistory.push("/");
          }}
          direction="left"
          linkText="Go back"
        />
      </Navigation>
      <NotFoundChecks portable={mediaPortable}>
        <div className="container mx-auto mt-40 mb-16 max-w-[1100px]">
          <MediaViewContent portable={mediaPortable as MWPortableMedia} />
        </div>
      </NotFoundChecks>
    </div>
  );
}
