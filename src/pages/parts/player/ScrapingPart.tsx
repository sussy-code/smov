import { ScrapeMedia } from "@movie-web/providers";
import { useCallback, useEffect, useRef, useState } from "react";

import { MWStreamType } from "@/backend/helpers/streams";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { providers } from "@/utils/providers";

export interface ScrapingProps {
  media: ScrapeMedia;
  // onGetStream?: () => void;
}

export interface ScrapingSegment {
  name: string;
  id: string;
  status: "failure" | "pending" | "notfound" | "success" | "waiting";
  reason?: string;
  percentage: number;
}

export interface ScrapingItems {
  id: string;
  children: string[];
}

function useScrape() {
  const [sources, setSources] = useState<Record<string, ScrapingSegment>>({});
  const [sourceOrder, setSourceOrder] = useState<ScrapingItems[]>([]);

  const startScraping = useCallback(
    async (media: ScrapeMedia) => {
      if (!providers) return;
      const output = await providers.runAll({
        media,
        events: {
          init(evt) {
            setSources(
              evt.sourceIds
                .map((v) => {
                  const source = providers.getMetadata(v);
                  if (!source) throw new Error("invalid source id");
                  const out: ScrapingSegment = {
                    name: source.name,
                    id: source.id,
                    status: "waiting",
                    percentage: 0,
                  };
                  return out;
                })
                .reduce<Record<string, ScrapingSegment>>((a, v) => {
                  a[v.id] = v;
                  return a;
                }, {})
            );
            setSourceOrder(evt.sourceIds.map((v) => ({ id: v, children: [] })));
          },
          start(id) {
            setSources((s) => {
              if (s[id]) s[id].status = "pending";
              return { ...s };
            });
          },
          update(evt) {
            setSources((s) => {
              if (s[evt.id]) {
                s[evt.id].status = evt.status;
                s[evt.id].reason = evt.reason;
                s[evt.id].percentage = evt.percentage;
              }
              return { ...s };
            });
          },
          discoverEmbeds(evt) {
            setSources((s) => {
              evt.embeds.forEach((v) => {
                const source = providers.getMetadata(v.embedScraperId);
                if (!source) throw new Error("invalid source id");
                const out: ScrapingSegment = {
                  name: source.name,
                  id: v.id,
                  status: "waiting",
                  percentage: 0,
                };
                s[v.id] = out;
              });
              return { ...s };
            });
            setSourceOrder((s) => {
              const source = s.find((v) => v.id === evt.sourceId);
              if (!source) throw new Error("invalid source id");
              source.children = evt.embeds.map((v) => v.id);
              return [...s];
            });
          },
        },
      });

      return output;
    },
    [setSourceOrder, setSources]
  );

  return {
    startScraping,
    sourceOrder,
    sources,
  };
}

export function ScrapingPart(props: ScrapingProps) {
  const { playMedia } = usePlayer();
  const { startScraping, sourceOrder, sources } = useScrape();

  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      const output = await startScraping(props.media);
      if (output?.stream.type !== "file") return;
      const firstFile = Object.values(output.stream.qualities)[0];
      playMedia({
        type: MWStreamType.MP4,
        url: firstFile.url,
      });
    })();
  }, [startScraping, props, playMedia]);

  return (
    <div className="h-full w-full flex items-center justify-center flex-col">
      {sourceOrder.map((order) => {
        const source = sources[order.id];
        if (!source) return null;
        return (
          <div key={order.id}>
            <p className="font-bold text-white">{source.name}</p>
            <p>
              status: {source.status} ({source.percentage}%)
            </p>
            <p>reason: {source.reason}</p>
            {order.children.map((embedId) => {
              const embed = sources[embedId];
              if (!embed) return null;
              return (
                <div key={embedId} className="border border-blue-300 rounded">
                  <p className="font-bold text-white">{embed.name}</p>
                  <p>
                    status: {embed.status} ({embed.percentage}%)
                  </p>
                  <p>reason: {embed.reason}</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
