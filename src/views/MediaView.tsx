// import { ReactElement, useCallback, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { IconPatch } from "@/components/buttons/IconPatch";
// import { Icons } from "@/components/Icon";
// import { Navigation } from "@/components/layout/Navigation";
// import { Paper } from "@/components/layout/Paper";
// import { LoadingSeasons, Seasons } from "@/components/layout/Seasons";
// import { DecoratedVideoPlayer } from "@/components/video/DecoratedVideoPlayer";
// import { ArrowLink } from "@/components/text/ArrowLink";
// import { DotList } from "@/components/text/DotList";
// import { Title } from "@/components/text/Title";
// import { useLoading } from "@/hooks/useLoading";
// import { usePortableMedia } from "@/hooks/usePortableMedia";
// import {
//   getIfBookmarkedFromPortable,
//   useBookmarkContext,
// } from "@/state/bookmark";
// import { getWatchedFromPortable, useWatchedContext } from "@/state/watched";
// import { SourceControl } from "@/components/video/controls/SourceControl";
// import { ProgressListenerControl } from "@/components/video/controls/ProgressListenerControl";
// import { Loading } from "@/components/layout/Loading";
// import { NotFoundChecks } from "./notfound/NotFoundChecks";

import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { ArrowLink } from "@/components/text/ArrowLink";

// interface StyledMediaViewProps {
//   media: MWMedia;
//   stream: MWMediaStream;
// }

// export function SkeletonVideoPlayer(props: { error?: boolean }) {
//   return (
//     <div className="flex aspect-video w-full items-center justify-center bg-denim-200 lg:rounded-xl">
//       {props.error ? (
//         <div className="flex flex-col items-center">
//           <IconPatch icon={Icons.WARNING} className="text-red-400" />
//           <p className="mt-5 text-white">Couldn&apos;t get your stream</p>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center">
//           <Loading />
//           <p className="mt-3 text-white">Getting your stream...</p>
//         </div>
//       )}
//     </div>
//   );
// }

// function StyledMediaView(props: StyledMediaViewProps) {
//   const reactHistory = useHistory();
//   const watchedStore = useWatchedContext();
//   const startAtTime: number | undefined = getWatchedFromPortable(
//     watchedStore.watched.items,
//     props.media
//   )?.progress;

//   const updateProgress = useCallback(
//     (time: number, duration: number) => {
//       // Don't update stored progress if less than 30s into the video
//       if (time <= 30) return;
//       watchedStore.updateProgress(props.media, time, duration);
//     },
//     [props, watchedStore]
//   );

//   const goBack = useCallback(() => {
//     if (reactHistory.action !== "POP") reactHistory.goBack();
//     else reactHistory.push("/");
//   }, [reactHistory]);

//   return (
//     <div className="overflow-hidden lg:rounded-xl">
//       <DecoratedVideoPlayer title={props.media.title} onGoBack={goBack}>
//         <SourceControl source={props.stream.url} type={props.stream.type} />
//         <ProgressListenerControl
//           startAt={startAtTime}
//           onProgress={updateProgress}
//         />
//       </DecoratedVideoPlayer>
//     </div>
//   );
// }

// interface StyledMediaFooterProps {
//   media: MWMedia;
//   provider: MWMediaProvider;
// }

// function StyledMediaFooter(props: StyledMediaFooterProps) {
//   const { setItemBookmark, getFilteredBookmarks } = useBookmarkContext();
//   const isBookmarked = getIfBookmarkedFromPortable(
//     getFilteredBookmarks(),
//     props.media
//   );

//   return (
//     <Paper className="mt-5">
//       <div className="flex">
//         <div className="flex-1">
//           <Title>{props.media.title}</Title>
//           <DotList
//             className="mt-3 text-sm"
//             content={[
//               props.provider.displayName,
//               props.media.mediaType,
//               props.media.year,
//             ]}
//           />
//         </div>
//         <div>
//           <IconPatch
//             icon={Icons.BOOKMARK}
//             active={isBookmarked}
//             onClick={() => setItemBookmark(props.media, !isBookmarked)}
//             clickable
//           />
//         </div>
//       </div>
//       {props.media.mediaType !== MWMediaType.MOVIE ? (
//         <Seasons media={props.media} />
//       ) : null}
//     </Paper>
//   );
// }

// function LoadingMediaFooter(props: { error?: boolean }) {
//   const { t } = useTranslation();

//   return (
//     <Paper className="mt-5">
//       <div className="flex">
//         <div className="flex-1">
//           <div className="mb-2 h-4 w-48 rounded-full bg-denim-500" />
//           <div>
//             <span className="mr-4 inline-block h-2 w-12 rounded-full bg-denim-400" />
//             <span className="mr-4 inline-block h-2 w-12 rounded-full bg-denim-400" />
//           </div>
//           {props.error ? (
//             <div className="flex items-center space-x-3">
//               <IconPatch icon={Icons.WARNING} className="text-red-400" />
//               <p>{t("media.invalidUrl")}</p>
//             </div>
//           ) : (
//             <LoadingSeasons />
//           )}
//         </div>
//       </div>
//     </Paper>
//   );
// }

// function MediaViewContent(props: { portable: MWPortableMedia }) {
//   const mediaPortable = props.portable;
//   const [streamUrl, setStreamUrl] = useState<MWMediaStream | undefined>();
//   const [media, setMedia] = useState<MWMedia | undefined>();
//   const [fetchMedia, loadingPortable, errorPortable] = useLoading(
//     (portable: MWPortableMedia) => convertPortableToMedia(portable)
//   );
//   const [fetchStream, loadingStream, errorStream] = useLoading(
//     (portable: MWPortableMedia) => getStream(portable)
//   );

//   useEffect(() => {
//     (async () => {
//       if (mediaPortable) {
//         setMedia(await fetchMedia(mediaPortable));
//       }
//     })();
//   }, [mediaPortable, setMedia, fetchMedia]);

//   useEffect(() => {
//     (async () => {
//       if (mediaPortable) {
//         setStreamUrl(await fetchStream(mediaPortable));
//       }
//     })();
//   }, [mediaPortable, setStreamUrl, fetchStream]);

//   let playerContent: ReactElement | null = null;
//   if (loadingStream) playerContent = <SkeletonVideoPlayer />;
//   else if (errorStream) playerContent = <SkeletonVideoPlayer error />;
//   else if (media && streamUrl)
//     playerContent = <StyledMediaView media={media} stream={streamUrl} />;

//   let footerContent: ReactElement | null = null;
//   if (loadingPortable) footerContent = <LoadingMediaFooter />;
//   else if (errorPortable) footerContent = <LoadingMediaFooter error />;
//   else if (mediaPortable && media)
//     footerContent = (
//       <StyledMediaFooter
//         provider={
//           getProviderFromId(mediaPortable.providerId) as MWMediaProvider
//         }
//         media={media}
//       />
//     );

//   return (
//     <>
//       {playerContent}
//       {footerContent}
//     </>
//   );
// }

export function MediaView() {
  const { t } = useTranslation();
  // const mediaPortable: MWPortableMedia | undefined = usePortableMedia();
  const reactHistory = useHistory();

  return (
    <div className="flex min-h-screen w-full">
      <Navigation>
        <ArrowLink
          onClick={() =>
            reactHistory.action !== "POP"
              ? reactHistory.goBack()
              : reactHistory.push("/")
          }
          direction="left"
          linkText={t("media.arrowText")}
        />
      </Navigation>
      {/* <NotFoundChecks portable={mediaPortable}>
        <div className="container mx-auto mt-40 mb-16 max-w-[1100px]">
          <MediaViewContent portable={mediaPortable as MWPortableMedia} />
        </div>
      </NotFoundChecks> */}
    </div>
  );
}
