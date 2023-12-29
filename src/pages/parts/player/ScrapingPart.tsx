import { ProviderControls, ScrapeMedia } from "@movie-web/providers";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { useMountedState } from "react-use";
import type { AsyncReturnType } from "type-fest";

import {
  scrapePartsToProviderMetric,
  useReportProviders,
} from "@/backend/helpers/report";
import {
  ScrapeCard,
  ScrapeItem,
} from "@/components/player/internals/ScrapeCard";
import {
  ScrapingItems,
  ScrapingSegment,
  useListCenter,
  useScrape,
} from "@/hooks/useProviderScrape";

export interface ScrapingProps {
  media: ScrapeMedia;
  onGetStream?: (stream: AsyncReturnType<ProviderControls["runAll"]>) => void;
  onResult?: (
    sources: Record<string, ScrapingSegment>,
    sourceOrder: ScrapingItems[],
  ) => void;
}

export function ScrapingPart(props: ScrapingProps) {
  const { report } = useReportProviders();
  const { startScraping, sourceOrder, sources, currentSource } = useScrape();
  const isMounted = useMountedState();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const renderedOnce = useListCenter(
    containerRef,
    listRef,
    sourceOrder,
    currentSource,
  );

  const resultRef = useRef({
    sourceOrder,
    sources,
  });
  useEffect(() => {
    resultRef.current = {
      sourceOrder,
      sources,
    };
  }, [sourceOrder, sources]);

  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      const output = await startScraping(props.media);
      if (!isMounted()) return;
      props.onResult?.(
        resultRef.current.sources,
        resultRef.current.sourceOrder,
      );
      report(
        scrapePartsToProviderMetric(
          props.media,
          resultRef.current.sourceOrder,
          resultRef.current.sources,
        ),
      );
      props.onGetStream?.(output);
    })();
  }, [startScraping, props, report, isMounted]);

  let currentProviderIndex = sourceOrder.findIndex(
    (s) => s.id === currentSource || s.children.includes(currentSource ?? ""),
  );
  if (currentProviderIndex === -1)
    currentProviderIndex = sourceOrder.length - 1;

  return (
    <div
      className="h-full w-full relative dir-neutral:origin-top-left flex"
      ref={containerRef}
    >
      <div
        className={classNames({
          "absolute transition-[transform,opacity] opacity-0 dir-neutral:left-0":
            true,
          "!opacity-100": renderedOnce,
        })}
        ref={listRef}
      >
        {sourceOrder.map((order) => {
          const source = sources[order.id];
          const distance = Math.abs(
            sourceOrder.findIndex((t) => t.id === order.id) -
              currentProviderIndex,
          );
          return (
            <div
              className="transition-opacity duration-100"
              style={{ opacity: Math.max(0, 1 - distance * 0.3) }}
              key={order.id}
            >
              <ScrapeCard
                id={order.id}
                name={source.name}
                status={source.status}
                hasChildren={order.children.length > 0}
                percentage={source.percentage}
              >
                <div
                  className={classNames({
                    "space-y-6 mt-8": order.children.length > 0,
                  })}
                >
                  {order.children.map((embedId) => {
                    const embed = sources[embedId];
                    return (
                      <ScrapeItem
                        id={embedId}
                        name={embed.name}
                        status={embed.status}
                        percentage={embed.percentage}
                        key={embedId}
                      />
                    );
                  })}
                </div>
              </ScrapeCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
