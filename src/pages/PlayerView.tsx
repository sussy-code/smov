import { MWStreamType } from "@/backend/helpers/streams";
import { Player } from "@/components/player";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { PlayerHoverState } from "@/stores/player/slices/interface";
import { playerStatus } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

export function PlayerView() {
  const { status, playMedia, setScrapeStatus } = usePlayer();
  const hovering = usePlayerStore((s) => s.interface.hovering);

  function scrape() {
    playMedia({
      type: MWStreamType.MP4,
      // url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      url: "http://95.111.247.180/darude.mp4",
    });
  }

  const showControlElements = hovering !== PlayerHoverState.NOT_HOVERING;

  return (
    <Player.Container onLoad={setScrapeStatus}>
      <Player.BottomControls show={showControlElements}>
        <Player.Pause />
        <Player.Fullscreen />
      </Player.BottomControls>

      {status === playerStatus.SCRAPING ? (
        <div className="w-full h-screen">
          <p>Its now scraping</p>
          <button type="button" onClick={scrape}>
            Finish scraping
          </button>
        </div>
      ) : null}
    </Player.Container>
  );
}
