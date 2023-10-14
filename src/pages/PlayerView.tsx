import { RunOutput } from "@movie-web/providers";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { MWStreamType } from "@/backend/helpers/streams";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { usePlayerMeta } from "@/components/player/hooks/usePlayerMeta";
import { convertRunoutputToSource } from "@/components/player/utils/convertRunoutputToSource";
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
      if (!out) return;
      playMedia(convertRunoutputToSource(out));
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
