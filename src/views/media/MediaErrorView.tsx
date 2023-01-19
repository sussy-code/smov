import { MWMediaMeta } from "@/backend/metadata/types";
import { ErrorMessage } from "@/components/layout/ErrorBoundary";
import { Link } from "@/components/text/Link";
import { VideoPlayerHeader } from "@/components/video/parts/VideoPlayerHeader";
import { useGoBack } from "@/hooks/useGoBack";
import { conf } from "@/setup/config";

export function MediaFetchErrorView() {
  const goBack = useGoBack();

  return (
    <div className="h-screen flex-1">
      <div className="fixed inset-x-0 top-0 py-6 px-8">
        <VideoPlayerHeader onClick={goBack} />
      </div>
      <ErrorMessage>
        <p className="my-6 max-w-lg">
          We failed to request the media you asked for, check your internet
          connection and try again.
        </p>
      </ErrorMessage>
    </div>
  );
}

export function MediaPlaybackErrorView(props: { media?: MWMediaMeta }) {
  const goBack = useGoBack();

  return (
    <div className="h-screen flex-1">
      <div className="fixed inset-x-0 top-0 py-6 px-8">
        <VideoPlayerHeader onClick={goBack} media={props.media} />
      </div>
      <ErrorMessage>
        <p className="my-6 max-w-lg">
          We encountered an error while playing the video you requested. If this
          keeps happening please report the issue to the
          <Link url={conf().DISCORD_LINK} newTab>
            Discord server
          </Link>{" "}
          or on{" "}
          <Link url={conf().GITHUB_LINK} newTab>
            GitHub
          </Link>
          .
        </p>
      </ErrorMessage>
    </div>
  );
}
