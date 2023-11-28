import { ScrapeMedia } from "@movie-web/providers";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

import { providers } from "@/utils/providers";

export interface ScrapingItems {
  id: string;
  children: string[];
}

export interface ScrapingSegment {
  name: string;
  id: string;
  embedId?: string;
  status: "failure" | "pending" | "notfound" | "success" | "waiting";
  reason?: string;
  error?: unknown;
  percentage: number;
}

export function useScrape() {
  const [sources, setSources] = useState<Record<string, ScrapingSegment>>({});
  const [sourceOrder, setSourceOrder] = useState<ScrapingItems[]>([]);
  const [currentSource, setCurrentSource] = useState<string>();

  const startScraping = useCallback(
    async (media: ScrapeMedia) => {
      if (!providers) return null;

      let lastId: string | null = null;
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
            lastId = id;
          },
          update(evt) {
            setSources((s) => {
              if (s[evt.id]) {
                s[evt.id].status = evt.status;
                s[evt.id].reason = evt.reason;
                s[evt.id].error = evt.error;
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
                  embedId: v.embedScraperId,
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

      if (output && lastId) {
        setSources((s) => {
          if (!lastId) return s;
          if (s[lastId]) s[lastId].status = "success";
          return { ...s };
        });
      }

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

export function useListCenter(
  containerRef: RefObject<HTMLDivElement | null>,
  listRef: RefObject<HTMLDivElement | null>,
  sourceOrder: ScrapingItems[],
  currentSource: string | undefined
) {
  const [renderedOnce, setRenderedOnce] = useState(false);

  const updatePosition = useCallback(() => {
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

    const listTop = listRef.current.getBoundingClientRect().top;

    const currentTop = currentElement.getBoundingClientRect().top;
    const currentHeight = currentElement.getBoundingClientRect().height;

    const topDifference = currentTop - listTop;

    const listNewLeft = containerWidth / 2 - listWidth / 2;
    const listNewTop = containerHeight / 2 - topDifference - currentHeight / 2;

    listRef.current.style.transform = `translateY(${listNewTop}px) translateX(${listNewLeft}px)`;
    setTimeout(() => {
      setRenderedOnce(true);
    }, 150);
  }, [currentSource, containerRef, listRef, setRenderedOnce]);

  const updatePositionRef = useRef(updatePosition);

  useEffect(() => {
    updatePosition();
    updatePositionRef.current = updatePosition;
  }, [updatePosition, sourceOrder]);

  useEffect(() => {
    function resize() {
      updatePositionRef.current();
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return renderedOnce;
}
