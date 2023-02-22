import { MWProviderScrapeResult } from "@/backend/helpers/provider";
import { getProviders } from "@/backend/helpers/register";
import { runProvider } from "@/backend/helpers/run";
import { DetailedMeta } from "@/backend/metadata/getmeta";
import { MWMediaType } from "@/backend/metadata/types";
import { Navigation } from "@/components/layout/Navigation";
import { ArrowLink } from "@/components/text/ArrowLink";
import { Title } from "@/components/text/Title";
import { useLoading } from "@/hooks/useLoading";
import { ReactNode, useEffect, useState } from "react";

interface MediaSelectorProps {
  onSelect: (meta: DetailedMeta) => void;
}

interface ProviderSelectorProps {
  onSelect: (providerId: string) => void;
}

interface MediaScraperProps {
  media: DetailedMeta | null;
  id: string;
}

function MediaSelector(props: MediaSelectorProps) {
  const options: DetailedMeta[] = [
    {
      imdbId: "tt10954562",
      tmdbId: "572716",
      meta: {
        id: "439596",
        title: "Hamilton",
        type: MWMediaType.MOVIE,
        year: "2020",
        seasons: undefined,
      },
    },
    {
      imdbId: "tt11126994",
      tmdbId: "94605",
      meta: {
        id: "222333",
        title: "Arcane",
        type: MWMediaType.SERIES,
        year: "2021",
        seasons: [
          {
            id: "230301",
            number: 1,
            title: "Season 1",
          },
        ],
        seasonData: {
          id: "230301",
          number: 1,
          title: "Season 1",
          episodes: [
            {
              id: "4243445",
              number: 1,
              title: "Welcome to the Playground",
            },
          ],
        },
      },
    },
  ];

  return (
    <div className="flex flex-col space-y-4">
      <Title className="mb-8">Choose media</Title>
      {options.map((v) => (
        <ArrowLink
          key={v.imdbId}
          onClick={() => props.onSelect(v)}
          direction="right"
          linkText={`${v.meta.title} (${v.meta.type})`}
        />
      ))}
    </div>
  );
}

function MediaScraper(props: MediaScraperProps) {
  const [results, setResults] = useState<MWProviderScrapeResult | null>(null);
  const [percentage, setPercentage] = useState(0);

  const [scrape, loading, error] = useLoading(async (media: DetailedMeta) => {
    const provider = getProviders().find((v) => v.id === props.id);
    if (!provider) throw new Error("provider not found");
    const data = await runProvider(provider, {
      progress(num) {
        console.log(`SCRAPING AT ${num}%`);
        setPercentage(num);
      },
      media,
      type: media.meta.type as any,
    });
    console.log("got data", data);
    setResults(data);
  });

  useEffect(() => {
    if (props.media) {
      scrape(props.media);
    }
  }, [props.media, scrape]);

  if (loading) return <p>Scraping... ({percentage}%)</p>;
  if (error) return <p>Errored, check console</p>;

  return (
    <div>
      <Title className="mb-8">Output data</Title>
      <code>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </code>
    </div>
  );
}

function ProviderSelector(props: ProviderSelectorProps) {
  const providers = getProviders();

  return (
    <div className="flex flex-col space-y-4">
      <Title className="mb-8">Choose provider</Title>
      {providers.map((v) => (
        <ArrowLink
          key={v.id}
          onClick={() => props.onSelect(v.id)}
          direction="right"
          linkText={v.displayName}
        />
      ))}
    </div>
  );
}

export function ProviderTesterView() {
  const [media, setMedia] = useState<DetailedMeta | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);

  let content: ReactNode = null;
  if (!providerId) {
    content = <ProviderSelector onSelect={(id) => setProviderId(id)} />;
  } else if (!media) {
    content = <MediaSelector onSelect={(v) => setMedia(v)} />;
  } else {
    content = <MediaScraper id={providerId} media={media} />;
  }

  return (
    <div className="py-48">
      <Navigation />
      <div className="mx-8 overflow-x-auto">{content}</div>
    </div>
  );
}
