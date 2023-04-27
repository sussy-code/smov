import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { MWEmbed, MWEmbedType } from "@/backend/helpers/embed";
import { MWProviderScrapeResult } from "@/backend/helpers/provider";
import {
  getEmbedScraperByType,
  getProviders,
} from "@/backend/helpers/register";
import { runEmbedScraper, runProvider } from "@/backend/helpers/run";
import { MWStream } from "@/backend/helpers/streams";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { Loading } from "@/components/layout/Loading";
import { FloatingCardView } from "@/components/popout/FloatingCard";
import { FloatingView } from "@/components/popout/FloatingView";
import { useFloatingRouter } from "@/hooks/useFloatingRouter";
import { useLoading } from "@/hooks/useLoading";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useMeta } from "@/video/state/logic/meta";
import { useSource } from "@/video/state/logic/source";

import { PopoutListEntry } from "./PopoutUtils";

interface EmbedEntryProps {
  name: string;
  type: MWEmbedType;
  url: string;
  active: boolean;
  onSelect: (stream: MWStream) => void;
}

export function EmbedEntry(props: EmbedEntryProps) {
  const [scrapeEmbed, loading, error] = useLoading(async () => {
    const scraper = getEmbedScraperByType(props.type);
    if (!scraper) throw new Error("Embed scraper not found");
    const stream = await runEmbedScraper(scraper, {
      progress: () => {}, // no progress tracking for inline scraping
      url: props.url,
    });
    props.onSelect(stream);
  });

  return (
    <PopoutListEntry
      isOnDarkBackground
      loading={loading}
      errored={!!error}
      active={props.active}
      onClick={() => {
        scrapeEmbed();
      }}
    >
      {props.name}
    </PopoutListEntry>
  );
}

export function SourceSelectionPopout(props: {
  router: ReturnType<typeof useFloatingRouter>;
  prefix: string;
}) {
  const { t } = useTranslation();

  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const meta = useMeta(descriptor);
  const { source } = useSource(descriptor);
  const providerRef = useRef<string | null>(null);

  const providers = useMemo(
    () =>
      meta
        ? getProviders().filter((v) => v.type.includes(meta.meta.meta.type))
        : [],
    [meta]
  );

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [scrapeResult, setScrapeResult] =
    useState<MWProviderScrapeResult | null>(null);
  const selectedProviderPopulated = useMemo(
    () => providers.find((v) => v.id === selectedProvider) ?? null,
    [providers, selectedProvider]
  );
  const [runScraper, loading, error] = useLoading(
    async (providerId: string) => {
      const theProvider = providers.find((v) => v.id === providerId);
      if (!theProvider) throw new Error("Invalid provider");
      if (!meta) throw new Error("need meta");
      return runProvider(theProvider, {
        media: meta.meta,
        progress: () => {},
        type: meta.meta.meta.type,
        episode: meta.episode?.episodeId as any,
        season: meta.episode?.seasonId as any,
      });
    }
  );

  function selectSource(stream: MWStream) {
    controls.setSource({
      quality: stream.quality,
      source: stream.streamUrl,
      type: stream.type,
      embedId: stream.embedId,
      providerId: providerRef.current ?? undefined,
    });
    if (meta) {
      controls.setMeta({
        ...meta,
        captions: stream.captions,
      });
    }
    controls.closePopout();
  }

  const selectProvider = (providerId?: string) => {
    if (!providerId) {
      providerRef.current = null;
      setSelectedProvider(null);
      props.router.navigate(`/${props.prefix}/source`);
      return;
    }

    runScraper(providerId).then(async (v) => {
      if (!providerRef.current) return;
      if (v) {
        const len = v.embeds.length + (v.stream ? 1 : 0);
        if (len === 1) {
          const realStream = v.stream;
          if (!realStream) {
            const embed = v?.embeds[0];
            if (!embed) throw new Error("Embed scraper not found");
            const scraper = getEmbedScraperByType(embed.type);
            if (!scraper) throw new Error("Embed scraper not found");
            const stream = await runEmbedScraper(scraper, {
              progress: () => {}, // no progress tracking for inline scraping
              url: embed.url,
            });
            selectSource(stream);
            return;
          }
          selectSource(realStream);
          return;
        }
      }
      setScrapeResult(v ?? null);
    });
    providerRef.current = providerId;
    setSelectedProvider(providerId);
    props.router.navigate(`/${props.prefix}/source/embeds`);
  };

  const visibleEmbeds = useMemo(() => {
    const embeds = scrapeResult?.embeds || [];

    // Count embed types to determine if it should show a number behind the name
    const embedsPerType: Record<string, (MWEmbed & { displayName: string })[]> =
      {};
    for (const embed of embeds) {
      if (!embed.type) continue;
      if (!embedsPerType[embed.type]) embedsPerType[embed.type] = [];
      embedsPerType[embed.type].push({
        ...embed,
        displayName: embed.type,
      });
    }

    const embedsRes = Object.entries(embedsPerType).flatMap(([_, entries]) => {
      if (entries.length > 1)
        return entries.map((embed, i) => ({
          ...embed,
          displayName: `${embed.type} ${i + 1}`,
        }));
      return entries;
    });

    return embedsRes;
  }, [scrapeResult?.embeds]);

  return (
    <>
      {/* List providers */}
      <FloatingView
        {...props.router.pageProps(props.prefix)}
        width={320}
        height={500}
      >
        <FloatingCardView.Header
          title={t("videoPlayer.popouts.sources")}
          description={t("videoPlayer.popouts.descriptions.sources")}
          goBack={() => props.router.navigate("/")}
        />
        <FloatingCardView.Content>
          {providers.map((v) => (
            <PopoutListEntry
              key={v.id}
              active={v.id === source?.providerId}
              onClick={() => {
                selectProvider(v.id);
              }}
            >
              {v.displayName}
            </PopoutListEntry>
          ))}
        </FloatingCardView.Content>
      </FloatingView>

      {/* List embeds */}
      <FloatingView
        {...props.router.pageProps(`embeds`)}
        width={320}
        height={500}
      >
        <FloatingCardView.Header
          title={selectedProviderPopulated?.displayName ?? ""}
          description={t("videoPlayer.popouts.descriptions.embeds")}
          goBack={() => props.router.navigate(`/${props.prefix}`)}
        />
        <FloatingCardView.Content>
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex flex-col flex-wrap items-center text-slate-400">
                <IconPatch
                  icon={Icons.EYE_SLASH}
                  className="text-xl text-bink-600"
                />
                <p className="mt-6 w-full text-center">
                  {t("videoPlayer.popouts.errors.embedsError")}
                </p>
              </div>
            </div>
          ) : (
            <>
              {scrapeResult?.stream ? (
                <PopoutListEntry
                  isOnDarkBackground
                  onClick={() => {
                    if (scrapeResult.stream) selectSource(scrapeResult.stream);
                  }}
                  active={
                    selectedProviderPopulated?.id === source?.providerId &&
                    selectedProviderPopulated?.id === source?.embedId
                  }
                >
                  Native source
                </PopoutListEntry>
              ) : null}
              {(visibleEmbeds?.length || 0) > 0 ? (
                visibleEmbeds?.map((v) => (
                  <EmbedEntry
                    type={v.type}
                    name={v.displayName ?? ""}
                    key={v.url}
                    url={v.url}
                    active={false} // TODO add embed id extractor
                    onSelect={(stream) => {
                      selectSource(stream);
                    }}
                  />
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col flex-wrap items-center text-slate-400">
                    <IconPatch
                      icon={Icons.EYE_SLASH}
                      className="text-xl text-bink-600"
                    />
                    <p className="mt-6 w-full text-center">
                      {t("videoPlayer.popouts.noEmbeds")}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </FloatingCardView.Content>
      </FloatingView>
    </>
  );
}
