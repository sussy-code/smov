import { useEffect, useMemo } from "react";

import { MWStreamType } from "@/backend/helpers/streams";
import { BrandPill } from "@/components/layout/BrandPill";
import { Player } from "@/components/player";
import { AutoPlayStart } from "@/components/player/atoms";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { useShouldShowControls } from "@/components/player/hooks/useShouldShowControls";
import { ScrapingPart } from "@/pages/parts/player/ScrapingPart";
import {
  PlayerMeta,
  metaToScrapeMedia,
  playerStatus,
} from "@/stores/player/slices/source";

export function PlayerView() {
  const { status, setScrapeStatus, playMedia, setMeta } = usePlayer();
  const { showTargets, showTouchTargets } = useShouldShowControls();

  const meta = useMemo<PlayerMeta>(
    () => ({
      type: "show",
      title: "Normal People",
      releaseYear: 2020,
      tmdbId: "89905",
      episode: { number: 12, tmdbId: "2207576", title: "Episode 12" },
      season: { number: 1, tmdbId: "125160", title: "Season 1" },
    }),
    []
  );

  useEffect(() => {
    setMeta(meta);
  }, [setMeta, meta]);
  const scrapeMedia = useMemo(() => metaToScrapeMedia(meta), [meta]);

  return (
    <Player.Container onLoad={setScrapeStatus}>
      {status === playerStatus.SCRAPING ? (
        <ScrapingPart
          media={scrapeMedia}
          onGetStream={(out) => {
            if (out?.stream.type !== "file") return;
            console.log(out.stream.qualities);
            const qualities = Object.keys(out.stream.qualities).sort(
              (a, b) => Number(b) - Number(a)
            ) as (keyof typeof out.stream.qualities)[];

            let file;
            for (const quality of qualities) {
              if (out.stream.qualities[quality]?.url) {
                console.log(quality);
                file = out.stream.qualities[quality];
                break;
              }
            }

            if (!file) return;

            playMedia({
              type: MWStreamType.MP4,
              url: file.url,
            });
          }}
        />
      ) : null}

      <Player.BlackOverlay show={showTargets} />

      <Player.CenterControls>
        <Player.LoadingSpinner />
        <AutoPlayStart />
      </Player.CenterControls>

      <Player.CenterMobileControls
        className="text-white"
        show={showTouchTargets}
      >
        <Player.SkipBackward iconSizeClass="text-3xl" />
        <Player.Pause iconSizeClass="text-5xl" />
        <Player.SkipForward iconSizeClass="text-3xl" />
      </Player.CenterMobileControls>

      <Player.TopControls show={showTargets}>
        <div className="grid grid-cols-[1fr,auto] xl:grid-cols-3 items-center">
          <div className="flex space-x-3 items-center">
            <Player.BackLink />
            <span className="text mx-3 text-type-secondary">/</span>
            <Player.Title />
            <Player.BookmarkButton />
          </div>
          <div className="text-center hidden xl:flex justify-center items-center">
            <Player.EpisodeTitle />
          </div>
          <div className="flex items-center justify-end">
            <BrandPill />
          </div>
        </div>
      </Player.TopControls>

      <Player.BottomControls show={showTargets}>
        <Player.ProgressBar />
        <div className="flex justify-between">
          <Player.LeftSideControls className="hidden lg:flex">
            <Player.Pause />
            <Player.SkipBackward />
            <Player.SkipForward />
            <Player.Volume />
            <Player.Time />
          </Player.LeftSideControls>
          <Player.LeftSideControls className="flex lg:hidden">
            {/* Do mobile controls here :) */}
            <Player.Time />
          </Player.LeftSideControls>
          <div className="flex items-center">
            <Player.Settings />
            <Player.Fullscreen />
          </div>
        </div>
      </Player.BottomControls>
    </Player.Container>
  );
}
