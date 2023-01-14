import { findBestStream } from "@/backend/helpers/scrape";
import { MWStream } from "@/backend/helpers/streams";
import { DetailedMeta } from "@/backend/metadata/getmeta";
import { useEffect, useState } from "react";

export interface ScrapeEventLog {
  type: "provider" | "embed";
  errored: boolean;
  percentage: number;
  id: string;
}

export function useScrape(meta: DetailedMeta) {
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
        onNext(ctx) {
          setEventLog((arr) => [
            ...arr,
            {
              errored: false,
              id: ctx.id,
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
  }, [meta]);

  return {
    stream,
    pending,
    eventLog,
  };
}
