import { useCallback } from "react";

import { MWStreamType } from "@/backend/helpers/streams";
import { Player } from "@/components/player";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { ScrapingPart } from "@/pages/parts/player/ScrapingPart";
import { playerStatus } from "@/stores/player/slices/source";

export function PlayerView() {
  const { status, playMedia, setScrapeStatus } = usePlayer();

  const startStream = useCallback(() => {
    playMedia({
      type: MWStreamType.MP4,
      // url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      // url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
      url: "http://95.111.247.180/frog.mp4",
    });
  }, [playMedia]);

  return (
    <Player.Container onLoad={setScrapeStatus}>
      <Player.BottomControls>
        <Player.ProgressBar />
        <div className="flex justify-between">
          <div className="flex space-x-3 items-center">
            <Player.Pause />
            <Player.SkipBackward />
            <Player.SkipForward />
            <Player.Time />
          </div>
          <div>
            <Player.Fullscreen />
          </div>
        </div>
      </Player.BottomControls>

      {status === playerStatus.SCRAPING ? (
        <ScrapingPart
          onGetStream={startStream}
          media={{
            type: "movie",
            title: "Hamilton",
            tmdbId: "556574",
            releaseYear: 2020,
          }}
        />
      ) : null}
    </Player.Container>
  );
}
