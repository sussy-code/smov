import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Navigation } from "@/components/layout/Navigation";
import { Title } from "@/components/text/Title";
import { Paragraph } from "@/components/utils/Text";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";

export function NotFoundPart() {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-1 flex-col">
      <Helmet>
        <title>{t("notFound.genericTitle")}</title>
      </Helmet>
      <Navigation />
      <div className="flex h-full flex-1 flex-col items-center justify-center p-5 text-center">
        <ErrorLayout>
          <ErrorContainer>
            <IconPill icon={Icons.EYE_SLASH}>
              {t("notFound.genericTitle")}
            </IconPill>
            <Title>Failed to load meta data</Title>
            <Paragraph>
              Oh, my apowogies, sweetie! The itty-bitty movie-web did its utmost
              bestest, but alas, no wucky videos to be spotted anywhere (´⊙ω⊙`)
              Please don&apos;t be angwy, wittle movie-web ish twying so hard.
              Can you find it in your heart to forgive? UwU 💖
            </Paragraph>
            <Button
              href="/"
              theme="purple"
              padding="md:px-12 p-2.5"
              className="mt-6"
            >
              Go home
            </Button>
          </ErrorContainer>
        </ErrorLayout>
      </div>
    </div>
  );
}
