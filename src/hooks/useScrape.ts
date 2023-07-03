import { useEffect, useState } from "react";

import { findBestStream } from "@/backend/helpers/scrape";
import { MWStream } from "@/backend/helpers/streams";
import { DetailedMeta } from "@/backend/metadata/getmeta";
import { MWMediaType } from "@/backend/metadata/types/mw";

export interface ScrapeEventLog {
  type: "provider" | "embed";
  errored: boolean;
  percentage: number;
  eventId: string;
  id: string;
}

export type SelectedMediaData =
  | {
      type: MWMediaType.SERIES;
      episode: string;
      season: string;
    }
  | {
      type: MWMediaType.MOVIE | MWMediaType.ANIME;
      episode: undefined;
      season: undefined;
    };

export function useScrape(meta: DetailedMeta, selected: SelectedMediaData) {
  const [eventLog, setEventLog] = useState<ScrapeEventLog[]>([]);
  const [stream, setStream] = useState<MWStream | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    setPending(true);
    setStream(null);
    setEventLog([]);
    (async () => {
      const scrapedStream = await findBestStream({
        media: meta,
        ...selected,
        onNext(ctx) {
          setEventLog((arr) => [
            ...arr,
            {
              errored: false,
              id: ctx.id,
              eventId: ctx.eventId,
              type: ctx.type,
              percentage: 0,
            },
          ]);
        },
        onProgress(ctx) {
          setEventLog((arr) => {
            const item = arr.reverse().find((v) => v.id === ctx.id);
            if (item) {
              item.errored = ctx.errored;
              item.percentage = ctx.percentage;
            }
            return [...arr];
          });
        },
      });

      setPending(false);
      setStream(scrapedStream);
    })();
  }, [meta, selected]);

  return {
    stream,
    pending,
    eventLog,
  };
}
