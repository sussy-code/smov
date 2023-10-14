import { RunOutput } from "@movie-web/providers";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { usePlayer } from "@/components/player/hooks/usePlayer";
import { usePlayerMeta } from "@/components/player/hooks/usePlayerMeta";
import { convertRunoutputToSource } from "@/components/player/utils/convertRunoutputToSource";
import { MetaPart } from "@/pages/parts/player/MetaPart";
import { PlayerPart } from "@/pages/parts/player/PlayerPart";
import { ScrapingPart } from "@/pages/parts/player/ScrapingPart";
import { PlayerMeta, playerStatus } from "@/stores/player/slices/source";

export function PlayerView() {
  const history = useHistory();
  const params = useParams<{
    media: string;
    episode?: string;
    season?: string;
  }>();
  const { status, playMedia, reset } = usePlayer();
  const { setPlayerMeta, scrapeMedia } = usePlayerMeta();
  const [backUrl] = useState("/"); // TODO redirect to search when needed

  const paramsData = JSON.stringify({
    media: params.media,
    season: params.season,
    episode: params.episode,
  });
  useEffect(() => {
    reset();
  }, [paramsData, reset]);

  const metaChange = useCallback(
    (meta: PlayerMeta) => {
      if (meta?.type === "show")
        history.push(
          `/media/${params.media}/${meta.season?.tmdbId}/${meta.episode?.tmdbId}`
        );
      else history.push(`/media/${params.media}`);
    },
    [history, params]
  );

  const playAfterScrape = useCallback(
    (out: RunOutput | null) => {
      if (!out) return;
      playMedia(convertRunoutputToSource(out));
    },
    [playMedia]
  );

  return (
    <PlayerPart backUrl={backUrl} onMetaChange={metaChange}>
      {status === playerStatus.IDLE ? (
        <MetaPart onGetMeta={setPlayerMeta} />
      ) : null}
      {status === playerStatus.SCRAPING && scrapeMedia ? (
        <ScrapingPart media={scrapeMedia} onGetStream={playAfterScrape} />
      ) : null}
    </PlayerPart>
  );
}
