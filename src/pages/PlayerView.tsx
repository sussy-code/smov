import { RunOutput } from "@movie-web/providers";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { usePlayer } from "@/components/player/hooks/usePlayer";
import { usePlayerMeta } from "@/components/player/hooks/usePlayerMeta";
import { convertRunoutputToSource } from "@/components/player/utils/convertRunoutputToSource";
import { ScrapingItems, ScrapingSegment } from "@/hooks/useProviderScrape";
import { MetaPart } from "@/pages/parts/player/MetaPart";
import { PlayerPart } from "@/pages/parts/player/PlayerPart";
import { ScrapeErrorPart } from "@/pages/parts/player/ScrapeErrorPart";
import { ScrapingPart } from "@/pages/parts/player/ScrapingPart";
import { useLastNonPlayerLink } from "@/stores/history";
import { PlayerMeta, playerStatus } from "@/stores/player/slices/source";

export function PlayerView() {
  const history = useHistory();
  const params = useParams<{
    media: string;
    episode?: string;
    season?: string;
  }>();
  const [errorData, setErrorData] = useState<{
    sources: Record<string, ScrapingSegment>;
    sourceOrder: ScrapingItems[];
  } | null>(null);
  const { status, playMedia, reset, setScrapeNotFound } = usePlayer();
  const { setPlayerMeta, scrapeMedia } = usePlayerMeta();
  const backUrl = useLastNonPlayerLink();

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
      playMedia(convertRunoutputToSource(out), out.sourceId);
    },
    [playMedia]
  );

  return (
    <PlayerPart backUrl={backUrl} onMetaChange={metaChange}>
      {status === playerStatus.IDLE ? (
        <MetaPart onGetMeta={setPlayerMeta} />
      ) : null}
      {status === playerStatus.SCRAPING && scrapeMedia ? (
        <ScrapingPart
          media={scrapeMedia}
          onResult={(sources, sourceOrder) => {
            setErrorData({
              sourceOrder,
              sources,
            });
            setScrapeNotFound();
          }}
          onGetStream={playAfterScrape}
        />
      ) : null}
      {status === playerStatus.SCRAPE_NOT_FOUND && errorData ? (
        <ScrapeErrorPart data={errorData} />
      ) : null}
    </PlayerPart>
  );
}
