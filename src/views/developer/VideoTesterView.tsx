import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";
import { DetailedMeta } from "@/backend/metadata/getmeta";
import { MWMediaType } from "@/backend/metadata/types";
import { Button } from "@/components/Button";
import { Navigation } from "@/components/layout/Navigation";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { MetaController } from "@/video/components/controllers/MetaController";
import { SourceController } from "@/video/components/controllers/SourceController";
import { VideoPlayer } from "@/video/components/VideoPlayer";
import { useCallback, useState } from "react";
import { Helmet } from "react-helmet";

interface VideoData {
  streamUrl: string;
}

const testData: VideoData = {
  streamUrl:
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
};
const testMeta: DetailedMeta = {
  imdbId: "",
  tmdbId: "",
  meta: {
    id: "hello-world",
    title: "Big Buck Bunny",
    type: MWMediaType.MOVIE,
    seasons: undefined,
    year: "2000",
  },
};

export function VideoTesterView() {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [url, setUrl] = useState("");

  const playVideo = useCallback((streamUrl: string) => {
    setVideo({
      streamUrl,
    });
  }, []);

  if (video) {
    return (
      <div className="fixed top-0 left-0 h-[100dvh] w-screen">
        <Helmet>
          <html data-full="true" />
        </Helmet>
        <VideoPlayer includeSafeArea autoPlay onGoBack={() => setVideo(null)}>
          <MetaController
            data={{
              captions: [],
              meta: testMeta,
            }}
            linkedCaptions={[]}
          />
          <SourceController
            source={video.streamUrl}
            type={MWStreamType.MP4}
            quality={MWStreamQuality.Q720P}
          />
        </VideoPlayer>
      </div>
    );
  }

  return (
    <div className="py-48">
      <Navigation />
      <ThinContainer classNames="flex items-start flex-col space-y-4">
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={() => playVideo(url)}>Play video</Button>
        </div>
        <Button onClick={() => playVideo(testData.streamUrl)}>
          Play default video
        </Button>
      </ThinContainer>
    </div>
  );
}
