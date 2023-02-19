import { useMemo, useRef, useState } from "react";
import { Icon, Icons } from "@/components/Icon";
import { useLoading } from "@/hooks/useLoading";
import { Loading } from "@/components/layout/Loading";
import { IconPatch } from "@/components/buttons/IconPatch";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMeta } from "@/video/state/logic/meta";
import { useControls } from "@/video/state/logic/controls";
import { MWStream } from "@/backend/helpers/streams";
import { getProviders } from "@/backend/helpers/register";
import { runProvider } from "@/backend/helpers/run";
import { MWProviderScrapeResult } from "@/backend/helpers/provider";
import { PopoutListEntry, PopoutSection } from "./PopoutUtils";
import { useTranslation } from "react-i18next";

export function SourceSelectionPopout() {
  const { t } = useTranslation()

  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const meta = useMeta(descriptor);
  const providers = useMemo(
    () =>
      meta ? getProviders().filter((v) => v.type.includes(meta.meta.meta.type)) : [],
    [meta]
  );

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [scrapeResult, setScrapeResult] =
    useState<MWProviderScrapeResult | null>(null);
  const showingProvider = !!selectedProvider;
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
        progress: () => { },
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
    });
    if (meta) {
      controls.setMeta({
        ...meta,
        captions: stream.captions,
      });
    }
    controls.closePopout();
  }

  const providerRef = useRef<string | null>(null);
  const selectProvider = (providerId?: string) => {
    if (!providerId) {
      providerRef.current = null;
      setSelectedProvider(null);
      return;
    }

    runScraper(providerId).then((v) => {
      if (!providerRef.current) return;
      if (v) {
        const len = v.embeds.length + (v.stream ? 1 : 0);
        if (len === 1) {
          const realStream = v.stream;
          if (!realStream) {
            // TODO scrape embed
            throw new Error("no embed scraper configured");
          }
          selectSource(realStream);
          return;
        }
      }
      setScrapeResult(v ?? null);
    });
    providerRef.current = providerId;
    setSelectedProvider(providerId);
  };

  const titlePositionClass = useMemo(() => {
    const offset = !showingProvider ? "left-0" : "left-10";
    return [
      "absolute w-full transition-[left,opacity] duration-200",
      offset,
    ].join(" ");
  }, [showingProvider]);

  return (
    <>
      <PopoutSection className="bg-ash-100 font-bold text-white">
        <div className="relative flex items-center">
          <button
            className={[
              "-m-1.5 rounded-lg p-1.5 transition-opacity duration-100 hover:bg-ash-200",
              !showingProvider ? "pointer-events-none opacity-0" : "opacity-1",
            ].join(" ")}
            onClick={() => selectProvider()}
            type="button"
          >
            <Icon icon={Icons.CHEVRON_LEFT} />
          </button>
          <span
            className={[
              titlePositionClass,
              showingProvider ? "opacity-1" : "opacity-0",
            ].join(" ")}
          >
            {selectedProviderPopulated?.displayName ?? ""}
          </span>
          <span
            className={[
              titlePositionClass,
              !showingProvider ? "opacity-1" : "opacity-0",
            ].join(" ")}
          >
            {t("videoPlayer.popouts.sources")}
          </span>
        </div>
      </PopoutSection>
      <div className="relative grid h-full grid-rows-[minmax(1px,1fr)]">
        <PopoutSection
          className={[
            "absolute inset-0 z-30 overflow-y-auto border-ash-400 bg-ash-100 transition-[max-height,padding] duration-200",
            showingProvider
              ? "max-h-full border-t"
              : "max-h-0 overflow-hidden py-0",
          ].join(" ")}
        >
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
                >
                  Native source
                </PopoutListEntry>
              ) : null}
              {scrapeResult?.embeds.map((v) => (
                <PopoutListEntry
                  isOnDarkBackground
                  key={v.url}
                  onClick={() => {
                    console.log("EMBED CHOSEN");
                  }}
                >
                  {v.type}
                </PopoutListEntry>
              ))}
            </>
          )}
        </PopoutSection>
        <PopoutSection className="relative h-full overflow-y-auto">
          <div>
            {providers.map((v) => (
              <PopoutListEntry
                key={v.id}
                onClick={() => {
                  selectProvider(v.id);
                }}
              >
                {v.displayName}
              </PopoutListEntry>
            ))}
          </div>
        </PopoutSection>
      </div>
    </>
  );
}
