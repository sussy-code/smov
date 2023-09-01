import { useTranslation } from "react-i18next";

import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { ArrowLink } from "@/components/text/ArrowLink";
import { Title } from "@/components/text/Title";
import { ErrorWrapperPart } from "@/pages/parts/errors/ErrorWrapperPart";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <ErrorWrapperPart>
      <IconPatch
        icon={Icons.EYE_SLASH}
        className="mb-6 text-xl text-bink-600"
      />
      <Title>{t("notFound.page.title")}</Title>
      <p className="mb-12 mt-5 max-w-sm">{t("notFound.page.description")}</p>
      <ArrowLink to="/" linkText={t("notFound.backArrow")} />
    </ErrorWrapperPart>
  );
}
