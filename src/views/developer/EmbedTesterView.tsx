import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { MWEmbed, MWEmbedScraper, MWEmbedType } from "@/backend/helpers/embed";
import { getEmbeds } from "@/backend/helpers/register";
import { runEmbedScraper } from "@/backend/helpers/run";
import { MWStream } from "@/backend/helpers/streams";
import { Button } from "@/components/Button";
import { Navigation } from "@/components/layout/Navigation";
import { ArrowLink } from "@/components/text/ArrowLink";
import { Title } from "@/components/text/Title";
import { useLoading } from "@/hooks/useLoading";

interface MediaSelectorProps {
  embedType: MWEmbedType;
  onSelect: (meta: MWEmbed) => void;
}

interface EmbedScraperSelectorProps {
  onSelect: (embedScraperId: string) => void;
}

interface MediaScraperProps {
  embed: MWEmbed;
  scraper: MWEmbedScraper;
}

function MediaSelector(props: MediaSelectorProps) {
  const [url, setUrl] = useState("");

  const select = useCallback(
    (urlSt: string) => {
      props.onSelect({
        type: props.embedType,
        url: urlSt,
      });
    },
    [props]
  );

  return (
    <div className="flex flex-col space-y-4">
      <Title className="mb-8">Input embed url</Title>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="embed url here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={() => select(url)}>Run scraper</Button>
      </div>
    </div>
  );
}

function MediaScraper(props: MediaScraperProps) {
  const [results, setResults] = useState<MWStream | null>(null);
  const [percentage, setPercentage] = useState(0);

  const [scrape, loading, error] = useLoading(async (url: string) => {
    const data = await runEmbedScraper(props.scraper, {
      url,
      progress(num) {
        console.log(`SCRAPING AT ${num}%`);
        setPercentage(num);
      },
    });
    console.log("got data", data);
    setResults(data);
  });

  useEffect(() => {
    if (props.embed) {
      scrape(props.embed.url);
    }
  }, [props.embed, scrape]);

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

function EmbedScraperSelector(props: EmbedScraperSelectorProps) {
  const embedScrapers = getEmbeds();

  return (
    <div className="flex flex-col space-y-4">
      <Title className="mb-8">Choose embed scraper</Title>
      {embedScrapers.map((v) => (
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

export default function EmbedTesterView() {
  const [embed, setEmbed] = useState<MWEmbed | null>(null);
  const [embedScraperId, setEmbedScraperId] = useState<string | null>(null);
  const embedScraper = useMemo(
    () => getEmbeds().find((v) => v.id === embedScraperId),
    [embedScraperId]
  );

  let content: ReactNode = null;
  if (!embedScraperId || !embedScraper) {
    content = <EmbedScraperSelector onSelect={(id) => setEmbedScraperId(id)} />;
  } else if (!embed) {
    content = (
      <MediaSelector
        embedType={embedScraper.for}
        onSelect={(v) => setEmbed(v)}
      />
    );
  } else {
    content = <MediaScraper scraper={embedScraper} embed={embed} />;
  }

  return (
    <div className="py-48">
      <Navigation />
      <div className="mx-8 overflow-x-auto">{content}</div>
    </div>
  );
}
