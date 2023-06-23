import { useCallback, useState } from "react";
import { Helmet } from "react-helmet";

import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";
import { DetailedMeta } from "@/backend/metadata/getmeta";
import { MWMediaType } from "@/backend/metadata/types/mw";
import { Button } from "@/components/Button";
import { Dropdown } from "@/components/Dropdown";
import { Navigation } from "@/components/layout/Navigation";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { MetaController } from "@/video/components/controllers/MetaController";
import { SourceController } from "@/video/components/controllers/SourceController";
import { VideoPlayer } from "@/video/components/VideoPlayer";

interface VideoData {
  streamUrl: string;
  type: MWStreamType;
}

const testData: VideoData = {
  streamUrl:
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  type: MWStreamType.MP4,
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

export default function VideoTesterView() {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [videoType, setVideoType] = useState<MWStreamType>(MWStreamType.MP4);
  const [url, setUrl] = useState("");

  const playVideo = useCallback(
    (streamUrl: string) => {
      setVideo({
        streamUrl,
        type: videoType,
      });
    },
    [videoType]
  );

  if (video) {
    return (
      <div className="fixed left-0 top-0 h-[100dvh] w-screen">
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
            type={videoType}
            quality={MWStreamQuality.QUNKNOWN}
            captions={[]}
          />
        </VideoPlayer>
      </div>
    );
  }

  return (
    <div className="py-64">
      <Navigation />
      <ThinContainer classNames="flex items-start flex-col space-y-4">
        <div className="w-48">
          <Dropdown
            options={[
              { id: MWStreamType.MP4, name: "Mp4" },
              { id: MWStreamType.HLS, name: "hls/m3u8" },
            ]}
            selectedItem={{ id: videoType, name: videoType }}
            setSelectedItem={(a) => setVideoType(a.id as MWStreamType)}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="stream url here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={() => playVideo(url)}>Play video</Button>
        </div>
        <Button
          onClick={() =>
            setVideo({
              streamUrl: testData.streamUrl,
              type: testData.type,
            })
          }
        >
          Play default video
        </Button>
      </ThinContainer>
    </div>
  );
}
