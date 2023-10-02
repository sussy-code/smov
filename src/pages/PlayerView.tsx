import { BrandPill } from "@/components/layout/BrandPill";
import { Player } from "@/components/player";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { useShouldShowControls } from "@/components/player/hooks/useShouldShowControls";
import { ScrapingPart } from "@/pages/parts/player/ScrapingPart";
import { playerStatus } from "@/stores/player/slices/source";

export function PlayerView() {
  const { status, setScrapeStatus } = usePlayer();
  const desktopControlsVisible = useShouldShowControls();

  return (
    <Player.Container onLoad={setScrapeStatus}>
      {status === playerStatus.SCRAPING ? (
        <ScrapingPart
          media={{
            type: "movie",
            title: "Everything Everywhere All At Once",
            tmdbId: "545611",
            releaseYear: 2022,
          }}
        />
      ) : null}

      <Player.BlackOverlay show={desktopControlsVisible} />
      <Player.TopControls show={desktopControlsVisible}>
        <div className="grid grid-cols-[1fr,auto] xl:grid-cols-3 items-center">
          <div className="flex space-x-3 items-center">
            <Player.BackLink />
            <Player.BookmarkButton />
          </div>
          <div className="text-center hidden xl:flex justify-center items-center">
            <span className="text-white font-medium mr-3">S1 E5</span>
            <span className="text-type-secondary font-medium">
              Mr. Jeebaloo discovers Atlantis
            </span>
          </div>
          <div className="flex items-center justify-end">
            <BrandPill />
          </div>
        </div>
      </Player.TopControls>
      <Player.BottomControls show={desktopControlsVisible}>
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
    </Player.Container>
  );
}
