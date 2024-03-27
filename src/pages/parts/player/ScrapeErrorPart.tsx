import { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { sendPage } from "@/backend/extension/messaging";
import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { useModal } from "@/components/overlays/Modal";
import { Paragraph } from "@/components/text/Paragraph";
import { Title } from "@/components/text/Title";
import { ScrapingItems, ScrapingSegment } from "@/hooks/useProviderScrape";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";
import { ExtensionStatus, getExtensionState } from "@/utils/onboarding";
import { getProviderApiUrls } from "@/utils/proxyUrls";

import { ErrorCardInModal } from "../errors/ErrorCard";

export interface ScrapeErrorPartProps {
  data: {
    sources: Record<string, ScrapingSegment>;
    sourceOrder: ScrapingItems[];
  };
}

export function ScrapeErrorPart(props: ScrapeErrorPartProps) {
  const { t } = useTranslation();
  const modal = useModal("error");
  const location = useLocation();
  const [extensionState, setExtensionState] =
    useState<ExtensionStatus>("unknown");
  const [title, setTitle] = useState(t("player.scraping.notFound.title"));
  const [icon, setIcon] = useState(Icons.WAND);

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
    getExtensionState().then((state: ExtensionStatus) => {
      setExtensionState(state);
      if (state === "disallowed") {
        setTitle(t("player.scraping.extensionFailure.disabledTitle"));
        setIcon(Icons.LOCK);
      }
    });
  }, [t]);

  if (extensionState === "disallowed") {
    return (
      <ErrorLayout>
        <ErrorContainer>
          <IconPill icon={icon}>{t("player.scraping.notFound.badge")}</IconPill>
          <Title>{title}</Title>
          <Paragraph>
            <Trans
              i18nKey="player.scraping.extensionFailure.text"
              components={{
                bold: (
                  <span className="font-bold" style={{ color: "#cfcfcf" }} />
                ),
              }}
            />
          </Paragraph>
          <div className="flex gap-3">
            <Button
              href="/"
              theme="secondary"
              padding="md:px-12 p-2.5"
              className="mt-6"
            >
              {t("player.scraping.notFound.homeButton")}
            </Button>
            <Button
              onClick={() => {
                sendPage({
                  page: "PermissionGrant",
                  redirectUrl: window.location.href,
                });
              }}
              theme="purple"
              padding="md:px-12 p-2.5"
              className="mt-6"
            >
              {t("player.scraping.extensionFailure.enableExtension")}
            </Button>
          </div>
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

  return (
    <ErrorLayout>
      <ErrorContainer>
        <IconPill icon={icon}>{t("player.scraping.notFound.badge")}</IconPill>
        <Title>{title}</Title>
        <Paragraph>
          <Trans
            i18nKey="player.scraping.notFound.text"
            components={{
              bold: <span className="font-bold" style={{ color: "#cfcfcf" }} />,
            }}
          />
        </Paragraph>
        <div className="flex gap-3">
          <Button
            href="/"
            theme="secondary"
            padding="md:px-12 p-2.5"
            className="mt-6"
          >
            {t("player.scraping.notFound.homeButton")}
          </Button>
          <Button
            onClick={() => {
              sendPage({
                page: "PermissionGrant",
                redirectUrl: window.location.href,
              });
            }}
            theme="purple"
            padding="md:px-12 p-2.5"
            className="mt-6"
          >
            {t("player.scraping.notFound.detailsButton")}
          </Button>
        </div>
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
