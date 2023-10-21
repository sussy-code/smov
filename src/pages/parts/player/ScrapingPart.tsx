import { ProviderControls, ScrapeMedia } from "@movie-web/providers";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import type { AsyncReturnType } from "type-fest";

import { usePlayer } from "@/components/player/hooks/usePlayer";
import {
  ScrapeCard,
  ScrapeItem,
} from "@/components/player/internals/ScrapeCard";
import { useListCenter, useScrape } from "@/hooks/useProviderScrape";

export interface ScrapingProps {
  media: ScrapeMedia;
  onGetStream?: (stream: AsyncReturnType<ProviderControls["runAll"]>) => void;
}

export function ScrapingPart(props: ScrapingProps) {
  const { playMedia } = usePlayer();
  const { startScraping, sourceOrder, sources, currentSource } = useScrape();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const renderedOnce = useListCenter(
    containerRef,
    listRef,
    sourceOrder,
    currentSource
  );

  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      const output = await startScraping(props.media);
      props.onGetStream?.(output);
    })();
  }, [startScraping, props, playMedia]);

  const currentProvider = sourceOrder.find(
    (s) => sources[s.id].status === "pending"
  );
  const currentProviderIndex =
    sourceOrder.findIndex((provider) => currentProvider?.id === provider.id) ??
    sourceOrder.length - 1;

  return (
    <div className="h-full w-full relative" ref={containerRef}>
      <div
        className={classNames({
          "absolute transition-[transform,opacity] opacity-0": true,
          "!opacity-100": renderedOnce,
        })}
        ref={listRef}
      >
        {sourceOrder.map((order) => {
          const source = sources[order.id];
          const distance = Math.abs(
            sourceOrder.findIndex((t) => t.id === order.id) -
              currentProviderIndex
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
