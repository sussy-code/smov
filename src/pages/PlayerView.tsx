import { RunOutput } from "@movie-web/providers";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { MWStreamType } from "@/backend/helpers/streams";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { usePlayerMeta } from "@/components/player/hooks/usePlayerMeta";
import { MetaPart } from "@/pages/parts/player/MetaPart";
import { PlayerPart } from "@/pages/parts/player/PlayerPart";
import { ScrapingPart } from "@/pages/parts/player/ScrapingPart";
import { playerStatus } from "@/stores/player/slices/source";

export function PlayerView() {
  const params = useParams<{
    media: string;
    episode?: string;
    season?: string;
  }>();
  const { status, playMedia, reset } = usePlayer();
  const { setPlayerMeta, scrapeMedia } = usePlayerMeta();
  const [backUrl] = useState("/"); // TODO redirect to search when needed

  useEffect(() => {
    reset();
  }, [params.media, reset]);

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
    <PlayerPart backUrl={backUrl}>
      {status === playerStatus.IDLE ? (
        <MetaPart onGetMeta={setPlayerMeta} />
      ) : null}
      {status === playerStatus.SCRAPING && scrapeMedia ? (
        <ScrapingPart media={scrapeMedia} onGetStream={playAfterScrape} />
      ) : null}
    </PlayerPart>
  );
}
