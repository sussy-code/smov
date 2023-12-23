import { useCallback, useState } from "react";

import { Button } from "@/components/buttons/Button";
import { Dropdown } from "@/components/form/Dropdown";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { Title } from "@/components/text/Title";
import { TextInputControl } from "@/components/text-inputs/TextInputControl";
import { PlaybackErrorPart } from "@/pages/parts/player/PlaybackErrorPart";
import { PlayerPart } from "@/pages/parts/player/PlayerPart";
import { PlayerMeta, playerStatus } from "@/stores/player/slices/source";
import { SourceSliceSource, StreamType } from "@/stores/player/utils/qualities";

const testMeta: PlayerMeta = {
  releaseYear: 2010,
  title: "Sintel",
  tmdbId: "",
  type: "movie",
};

const testStreams: Record<StreamType, string> = {
  hls: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
  mp4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
};

const streamTypes: Record<StreamType, string> = {
  hls: "HLS",
  mp4: "MP4",
};

export default function VideoTesterView() {
  const { status, playMedia, setMeta } = usePlayer();
  const [selected, setSelected] = useState("mp4");
  const [inputSource, setInputSource] = useState("");

  const start = useCallback(
    (url: string, type: StreamType) => {
      let source: SourceSliceSource;
      if (type === "hls") {
        source = {
          type: "hls",
          url,
        };
      } else if (type === "mp4") {
        source = {
          type: "file",
          qualities: {
            unknown: {
              type: "mp4",
              url,
            },
          },
        };
      } else throw new Error("Invalid type");
      setMeta(testMeta);
      playMedia(source, [], null);
    },
    [playMedia, setMeta],
  );

  return (
    <PlayerPart backUrl="/">
      {status === playerStatus.IDLE ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl rounded-xl bg-video-scraping-card p-10 m-4">
            <div className="flex gap-16 flex-col lg:flex-row">
              <div className="flex-1">
                <Title>Custom stream</Title>
                <div className="grid grid-cols-[1fr,auto] gap-2 items-center">
                  <TextInputControl
                    className="bg-video-context-flagBg rounded-md p-2 text-white w-full"
                    value={inputSource}
                    onChange={setInputSource}
                    placeholder="https://..."
                  />
                  <Dropdown
                    options={Object.entries(streamTypes).map((v) => ({
                      id: v[0],
                      name: v[1],
                    }))}
                    selectedItem={{
                      id: selected,
                      name: streamTypes[selected as StreamType],
                    }}
                    setSelectedItem={(item) => setSelected(item.id)}
                  />
                </div>
                <Button
                  onClick={() => start(inputSource, selected as StreamType)}
                >
                  Start stream
                </Button>
              </div>

              <div className="flex-1">
                <Title>Preset tests</Title>
                <div className="grid grid-cols-[1fr,1fr] gap-2">
                  <Button onClick={() => start(testStreams.hls, "hls")}>
                    HLS test
                  </Button>
                  <Button onClick={() => start(testStreams.mp4, "mp4")}>
                    MP4 test
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {status === playerStatus.PLAYBACK_ERROR ? <PlaybackErrorPart /> : null}
    </PlayerPart>
  );
}
