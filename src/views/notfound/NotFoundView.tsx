import { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { Navigation } from "@/components/layout/Navigation";
import { ArrowLink } from "@/components/text/ArrowLink";
import { Title } from "@/components/text/Title";
import { useGoBack } from "@/hooks/useGoBack";
import { VideoPlayerHeader } from "@/video/components/parts/VideoPlayerHeader";

export function NotFoundWrapper(props: {
  children?: ReactNode;
  video?: boolean;
}) {
  const { t } = useTranslation();
  const goBack = useGoBack();

  return (
    <div className="relative flex flex-1 flex-col">
      <Helmet>
        <title>{t("notFound.genericTitle")}</title>
      </Helmet>
      {props.video ? (
        <div className="absolute inset-x-0 top-0 px-8 py-6">
          <VideoPlayerHeader onClick={goBack} />
        </div>
      ) : (
        <Navigation />
      )}
      <div className="flex h-full flex-1 flex-col items-center justify-center p-5 text-center">
        {props.children}
      </div>
    </div>
  );
}

export function NotFoundMedia() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
      <IconPatch
        icon={Icons.EYE_SLASH}
        className="mb-6 text-xl text-bink-600"
      />
      <Title>{t("notFound.media.title")}</Title>
      <p className="mb-12 mt-5 max-w-sm">{t("notFound.media.description")}</p>
      <ArrowLink to="/" linkText={t("notFound.backArrow")} />
    </div>
  );
}

export function NotFoundProvider() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
      <IconPatch
        icon={Icons.EYE_SLASH}
        className="mb-6 text-xl text-bink-600"
      />
      <Title>{t("notFound.provider.title")}</Title>
      <p className="mb-12 mt-5 max-w-sm">
        {t("notFound.provider.description")}
      </p>
      <ArrowLink to="/" linkText={t("notFound.backArrow")} />
    </div>
  );
}

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <NotFoundWrapper>
      <IconPatch
        icon={Icons.EYE_SLASH}
        className="mb-6 text-xl text-bink-600"
      />
      <Title>{t("notFound.page.title")}</Title>
      <p className="mb-12 mt-5 max-w-sm">{t("notFound.page.description")}</p>
      <ArrowLink to="/" linkText={t("notFound.backArrow")} />
    </NotFoundWrapper>
  );
}
