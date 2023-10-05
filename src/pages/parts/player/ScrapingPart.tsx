import { ProviderControls, ScrapeMedia } from "@movie-web/providers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AsyncReturnType } from "type-fest";

import { usePlayer } from "@/components/player/hooks/usePlayer";
import {
  ScrapeCard,
  ScrapeItem,
} from "@/components/player/internals/ScrapeCard";
import { StatusCircle } from "@/components/player/internals/StatusCircle";
import { providers } from "@/utils/providers";

export interface ScrapingProps {
  media: ScrapeMedia;
  onGetStream?: (stream: AsyncReturnType<ProviderControls["runAll"]>) => void;
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
  const [currentSource, setCurrentSource] = useState<string>();

  const startScraping = useCallback(
    async (media: ScrapeMedia) => {
      if (!providers) return null;
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
            setCurrentSource(id);
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
    currentSource,
  };
}

export function ScrapingPart(props: ScrapingProps) {
  const { playMedia } = usePlayer();
  const { startScraping, sourceOrder, sources, currentSource } = useScrape();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!listRef.current) return;

    const elements = [
      ...listRef.current.querySelectorAll("div[data-source-id]"),
    ] as HTMLDivElement[];

    const currentIndex = elements.findIndex(
      (e) => e.getAttribute("data-source-id") === currentSource
    );

    const currentElement = elements[currentIndex];

    if (!currentElement) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const listWidth = listRef.current.getBoundingClientRect().width;

    const containerHeight = containerRef.current.getBoundingClientRect().height;
    const listHeight = listRef.current.getBoundingClientRect().height;

    const listTop = listRef.current.getBoundingClientRect().top;

    const currentTop = currentElement.getBoundingClientRect().top;
    const currentHeight = currentElement.getBoundingClientRect().height;

    const topDifference = currentTop - listTop;

    const listNewLeft = containerWidth / 2 - listWidth / 2;
    const listNewTop = containerHeight / 2 - topDifference + currentHeight / 2;

    listRef.current.style.left = `${listNewLeft}px`;
    listRef.current.style.top = `${listNewTop}px`;
  }, [sourceOrder, currentSource]);

  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      const output = await startScraping(props.media);
      props.onGetStream?.(output);
    })();
  }, [startScraping, props, playMedia]);

  return (
    <div className="h-full w-full relative" ref={containerRef}>
      <div className="absolute" ref={listRef}>
        {sourceOrder.map((order) => {
          const source = sources[order.id];
          return (
            <ScrapeCard
              id={order.id}
              name={source.name}
              status={source.status}
              hasChildren={order.children.length > 0}
              percentage={source.percentage}
              key={order.id}
            >
              {order.children.map((embedId) => {
                const embed = sources[embedId];
                return (
                  <ScrapeItem
                    id={embedId}
                    name={embed.name}
                    status={source.status}
                    percentage={embed.percentage}
                    key={embedId}
                  />
                );
              })}
            </ScrapeCard>
          );
        })}
      </div>
    </div>
  );
}
