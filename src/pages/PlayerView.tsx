import { RunOutput } from "@movie-web/providers";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "react-use";

import { MWStreamType } from "@/backend/helpers/streams";
import { getMetaFromId } from "@/backend/metadata/getmeta";
import { decodeTMDBId } from "@/backend/metadata/tmdb";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { usePlayerMeta } from "@/components/player/hooks/usePlayerMeta";
import { PlayerPart } from "@/pages/parts/player/PlayerPart";
import { ScrapingPart } from "@/pages/parts/player/ScrapingPart";
import { playerStatus } from "@/stores/player/slices/source";

export function PlayerView() {
  const params = useParams<{
    media: string;
    episode?: string;
    season?: string;
  }>();
  const { status, playMedia } = usePlayer();
  const { setPlayerMeta, scrapeMedia } = usePlayerMeta();

  const { loading, error } = useAsync(async () => {
    const data = decodeTMDBId(params.media);
    if (!data) return;

    const meta = await getMetaFromId(data.type, data.id, params.season);
    if (!meta) return;

    setPlayerMeta(meta);
  }, []);

  const playAfterScrape = useCallback(
    (out: RunOutput | null) => {
      if (out?.stream.type !== "file") return;
      const qualities = Object.keys(out.stream.qualities).sort(
        (a, b) => Number(b) - Number(a)
      ) as (keyof typeof out.stream.qualities)[];

      let file;
      for (const quality of qualities) {
        if (out.stream.qualities[quality]?.url) {
          file = out.stream.qualities[quality];
          break;
        }
      }

      if (!file) return;

      playMedia({
        type: MWStreamType.MP4,
        url: file.url,
      });
    },
    [playMedia]
  );

  return (
    <PlayerPart>
      {status === playerStatus.IDLE ? (
        <div className="flex items-center justify-center">
          {loading ? <p>loading meta...</p> : null}
          {error ? <p>failed to load meta!</p> : null}
        </div>
      ) : null}
      {status === playerStatus.SCRAPING && scrapeMedia ? (
        <ScrapingPart media={scrapeMedia} onGetStream={playAfterScrape} />
      ) : null}
    </PlayerPart>
  );
}
