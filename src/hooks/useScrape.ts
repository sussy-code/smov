import { findBestStream } from "@/backend/helpers/scrape";
import { MWStream } from "@/backend/helpers/streams";
import { useEffect, useState } from "react";

interface ScrapeEventLog {
  type: "provider" | "embed";
  errored: boolean;
  percentage: number;
  id: string;
}

export function useScrape() {
  const [eventLog, setEventLog] = useState<ScrapeEventLog[]>([]);
  const [stream, setStream] = useState<MWStream | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    setPending(true);
    setStream(null);
    setEventLog([]);
    (async () => {
      // TODO has test inputs
      const scrapedStream = await findBestStream({
        imdb: "test1",
        tmdb: "test2",
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
  }, []);

  return {
    stream,
    pending,
    eventLog,
  };
}
