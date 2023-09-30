import { MWStreamType } from "@/backend/helpers/streams";
import { Player } from "@/components/player";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { playerStatus } from "@/stores/player/slices/source";

export function PlayerView() {
  const { status, playMedia } = usePlayer();

  function scrape() {
    playMedia({
      type: MWStreamType.MP4,
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    });
  }

  return (
    <Player.Container>
      <Player.Pause />

      {status === playerStatus.IDLE ? (
        <div>
          <p>Its now scraping</p>
          <button type="button" onClick={scrape}>
            Finish scraping
          </button>
        </div>
      ) : null}
    </Player.Container>
  );
}
