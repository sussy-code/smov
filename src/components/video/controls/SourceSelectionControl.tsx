import { useParams } from "react-router-dom";
import { useCallback, useContext, useMemo, useState } from "react";
import { Icon, Icons } from "@/components/Icon";
import { getProviders } from "@/backend/helpers/register";
import { useLoading } from "@/hooks/useLoading";
import { DetailedMeta } from "@/backend/metadata/getmeta";
import { MWMediaType } from "@/backend/metadata/types";
import { MWProviderScrapeResult } from "@/backend/helpers/provider";
import { runProvider } from "@/backend/helpers/run";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Loading } from "@/components/layout/Loading";
import {
  useVideoPlayerState,
  VideoPlayerDispatchContext,
} from "../VideoContext";
import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";
import { VideoPopout } from "../parts/VideoPopout";

interface Props {
  className?: string;
  media?: DetailedMeta;
}

function PopoutSourceSelect(props: { media: DetailedMeta }) {
  const dispatch = useContext(VideoPlayerDispatchContext);
  const providers = useMemo(
    () => getProviders().filter((v) => v.type.includes(props.media.meta.type)),
    [props]
  );
  const { episode, season } = useParams<{ episode: string; season: string }>();
  const [selected, setSelected] = useState<string | null>(null);
  const selectedProvider = useMemo(
    () => providers.find((v) => v.id === selected),
    [selected, providers]
  );

  const [scrapeData, setScrapeData] = useState<MWProviderScrapeResult | null>(
    null
  );
  const [scrapeProvider, loadingProvider, errorProvider] = useLoading(
    async (providerId: string) => {
      const theProvider = providers.find((v) => v.id === providerId);
      if (!theProvider) throw new Error("Invalid provider");
      return runProvider(theProvider, {
        media: props.media,
        progress: () => {},
        type: props.media.meta.type,
        episode: (props.media.meta.type === MWMediaType.SERIES
          ? episode
          : undefined) as any,
        season: (props.media.meta.type === MWMediaType.SERIES
          ? season
          : undefined) as any,
      });
    }
  );

  // TODO add embed support
  // TODO restore startAt when changing source
  // TODO auto choose when only one option
  // TODO close when selecting item
  // TODO show currently selected provider
  // TODO clear error state when switching
  // const [scrapeEmbed, embedLoading, embedError] = useLoading(
  //   async (embed: MWEmbed) => {
  //     if (!embed.type) throw new Error("Invalid embed type");
  //     const theScraper = getEmbedScraperByType(embed.type);
  //     if (!theScraper) throw new Error("Invalid scraper");
  //     return runEmbedScraper(theScraper, {
  //       progress: () => {},
  //       url: embed.url,
  //     });
  //   }
  // );

  const selectProvider = useCallback(
    (id: string) => {
      scrapeProvider(id).then((v) => {
        if (!v) throw new Error("No scrape result");
        setScrapeData(v);
      });
      setSelected(id);
    },
    [setSelected, scrapeProvider]
  );

  if (!selectedProvider)
    return (
      <>
        <div className="flex items-center space-x-3 border-b border-denim-500 p-4 font-bold text-white">
          <span>Select video source</span>
        </div>
        <div className="overflow-y-auto p-4">
          <div className="space-y-1">
            {providers.map((e) => (
              <div
                className="text-denim-800 -mx-2 flex items-center space-x-1 rounded p-2 text-white hover:bg-denim-600"
                onClick={() => selectProvider(e.id)}
                key={e.id}
              >
                {e.displayName}
              </div>
            ))}
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className="flex items-center space-x-3 border-b border-denim-500 p-4 font-bold text-white">
        <button
          className="-m-1.5 rounded p-1.5 hover:bg-denim-600"
          onClick={() => setSelected(null)}
          type="button"
        >
          <Icon icon={Icons.CHEVRON_LEFT} />
        </button>
        <span>{selectedProvider.displayName}</span>
      </div>
      <div className="overflow-y-auto p-4 text-white">
        {loadingProvider ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loading />
          </div>
        ) : errorProvider ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col flex-wrap items-center text-slate-400">
              <IconPatch
                icon={Icons.EYE_SLASH}
                className="text-xl text-bink-600"
              />
              <p className="mt-6 w-full text-center">
                Something went wrong loading streams.
              </p>
            </div>
          </div>
        ) : scrapeData ? (
          <div>
            {scrapeData.stream ? (
              <div
                className="text-denim-800 -mx-2 flex items-center space-x-1 rounded p-2 text-white hover:bg-denim-600"
                onClick={() =>
                  scrapeData.stream &&
                  dispatch({
                    url: scrapeData.stream.streamUrl,
                    quality: scrapeData.stream.quality,
                    sourceType: scrapeData.stream.type,
                    type: "SET_SOURCE",
                  })
                }
              >
                {selectedProvider.displayName}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}

export function SourceSelectionControl(props: Props) {
  const { videoState } = useVideoPlayerState();

  if (!props.media) return null;

  return (
    <div className={props.className}>
      <div className="relative">
        <VideoPopout
          id="source"
          className="grid grid-rows-[auto,minmax(0,1fr)]"
        >
          <PopoutSourceSelect media={props.media} />
        </VideoPopout>
        <VideoPlayerIconButton
          icon={Icons.FILE}
          text="Video source"
          onClick={() => videoState.openPopout("source")}
        />
      </div>
    </div>
  );
}
