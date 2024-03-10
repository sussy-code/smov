import { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { isAllowedExtensionVersion } from "@/backend/extension/compatibility";
import { extensionInfo } from "@/backend/extension/messaging";
import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { useModal } from "@/components/overlays/Modal";
import { Paragraph } from "@/components/text/Paragraph";
import { Title } from "@/components/text/Title";
import { ScrapingItems, ScrapingSegment } from "@/hooks/useProviderScrape";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";
import { getProviderApiUrls } from "@/utils/proxyUrls";

import { ErrorCardInModal } from "../errors/ErrorCard";

type ExtensionStatus =
  | "unknown"
  | "failed"
  | "disallowed"
  | "noperms"
  | "outdated"
  | "success";

export interface ScrapeErrorPartProps {
  data: {
    sources: Record<string, ScrapingSegment>;
    sourceOrder: ScrapingItems[];
  };
}

async function getExtensionState(): Promise<ExtensionStatus> {
  const info = await extensionInfo();
  if (!info) return "unknown"; // cant talk to extension
  if (!info.success) return "failed"; // extension failed to respond
  if (!info.allowed) return "disallowed"; // extension is not enabled on this page
  if (!info.hasPermission) return "noperms"; // extension has no perms to do it's tasks
  if (!isAllowedExtensionVersion(info.version)) return "outdated"; // extension is too old
  return "success"; // no problems
}

export function ScrapeErrorPart(props: ScrapeErrorPartProps) {
  const { t } = useTranslation();
  const modal = useModal("error");
  const location = useLocation();
  const [extensionState, setExtensionState] =
    useState<ExtensionStatus>("unknown");

  const error = useMemo(() => {
    const data = props.data;
    let str = "";
    const apiUrls = getProviderApiUrls();
    str += `URL - ${location.pathname}\n`;
    str += `API - ${apiUrls.length > 0}\n\n`;
    Object.values(data.sources).forEach((v) => {
      str += `${v.id}: ${v.status}\n`;
      if (v.reason) str += `${v.reason}\n`;
      if (v.error?.message)
        str += `${v.error.name ?? "unknown"}: ${v.error.message}\n`;
      else if (v.error) str += `${v.error.toString()}\n`;
    });
    return str;
  }, [props, location]);

  useEffect(() => {
    getExtensionState().then(setExtensionState);
  }, []);

  return (
    <ErrorLayout>
      <ErrorContainer>
        <IconPill icon={Icons.WAND}>
          {t("player.scraping.notFound.badge")}
        </IconPill>
        <Title>{t("player.scraping.notFound.title")}</Title>
        <Paragraph>
          {extensionState === "disallowed" ? (
            <Trans
              i18nKey="player.scraping.notFound.text"
              components={{
                bold: (
                  <span className="font-bold" style={{ color: "#cfcfcf" }} />
                ),
              }}
            />
          ) : (
            <Trans
              i18nKey="player.scraping.notFound.text2"
              components={{
                bold: (
                  <span className="font-bold" style={{ color: "#cfcfcf" }} />
                ),
              }}
            />
          )}
        </Paragraph>
        <div className="flex gap-3">
          <Button
            onClick={() => window.location.reload()}
            theme="secondary"
            padding="md:px-12 p-2.5"
            className="mt-6"
          >
            {t("player.scraping.notFound.reloadButton")}
          </Button>
          <Button
            href="/"
            theme="secondary"
            padding="md:px-12 p-2.5"
            className="mt-6"
          >
            {t("player.scraping.notFound.homeButton")}
          </Button>
        </div>
        <Button
          onClick={() => modal.show()}
          theme="purple"
          padding="md:px-12 p-2.5"
          className="mt-6"
        >
          {t("player.scraping.notFound.detailsButton")}
        </Button>
      </ErrorContainer>
      {error ? (
        <ErrorCardInModal
          id={modal.id}
          onClose={() => modal.hide()}
          error={error}
        />
      ) : null}
    </ErrorLayout>
  );
}
