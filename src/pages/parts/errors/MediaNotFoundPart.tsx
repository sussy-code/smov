import { useTranslation } from "react-i18next";

import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { ArrowLink } from "@/components/text/ArrowLink";
import { Title } from "@/components/text/Title";

export function MediaNotFoundPart() {
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
