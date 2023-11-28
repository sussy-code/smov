import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Paragraph } from "@/components/text/Paragraph";
import { Title } from "@/components/text/Title";
import { ScrapingItems, ScrapingSegment } from "@/hooks/useProviderScrape";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";

import { ErrorCard } from "../errors/ErrorCard";

export interface ScrapeErrorPartProps {
  data: {
    sources: Record<string, ScrapingSegment>;
    sourceOrder: ScrapingItems[];
  };
}

export function ScrapeErrorPart(props: ScrapeErrorPartProps) {
  const { t } = useTranslation();
  const error = useMemo(() => {
    const data = props.data;
    const amountError = Object.values(data.sources).filter(
      (v) => v.status === "failure"
    );
    if (amountError.length === 0) return null;
    let str = "";
    Object.values(data.sources).forEach((v) => {
      str += `${v.id}: ${v.status}\n`;
      if (v.reason) str += `${v.reason}\n`;
      if (v.error) str += `${v.error.toString()}\n`;
    });
    return str;
  }, [props]);

  return (
    <ErrorLayout>
      <ErrorContainer>
        <IconPill icon={Icons.WAND}>
          {t("player.scraping.notFound.badge")}
        </IconPill>
        <Title>{t("player.scraping.notFound.title")}</Title>
        <Paragraph>{t("player.scraping.notFound.text")}</Paragraph>
        <Button
          href="/"
          theme="purple"
          padding="md:px-12 p-2.5"
          className="mt-6"
        >
          {t("player.scraping.notFound.homeButton")}
        </Button>
      </ErrorContainer>
      <ErrorContainer maxWidth="max-w-[45rem]">
        {/* Error */}
        {error ? <ErrorCard error={error} /> : null}
      </ErrorContainer>
    </ErrorLayout>
  );
}
