import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Paragraph } from "@/components/text/Paragraph";
import { Title } from "@/components/text/Title";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";
import { usePlayerStore } from "@/stores/player/store";

import { ErrorCard } from "../errors/ErrorCard";

export function PlaybackErrorPart() {
  const { t } = useTranslation();
  const playbackError = usePlayerStore((s) => s.interface.error);

  return (
    <ErrorLayout>
      <ErrorContainer>
        <IconPill icon={Icons.WAND}>{t("player.playbackError.badge")}</IconPill>
        <Title>{t("player.playbackError.title")}</Title>
        <Paragraph>{t("player.playbackError.text")}</Paragraph>
        <Button
          href="/"
          theme="purple"
          padding="md:px-12 p-2.5"
          className="mt-6"
        >
          {t("player.playbackError.homeButton")}
        </Button>
      </ErrorContainer>
      <ErrorContainer maxWidth="max-w-[45rem]">
        {/* Error */}
        {playbackError ? <ErrorCard error={playbackError} /> : null}
      </ErrorContainer>
    </ErrorLayout>
  );
}
