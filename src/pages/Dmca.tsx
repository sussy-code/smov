/* eslint-disable react/no-unescaped-entities */
import { useTranslation } from "react-i18next";

import { Icon, Icons } from "@/components/Icon";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { Heading1, Paragraph } from "@/components/utils/Text";

import { SubPageLayout } from "./layouts/SubPageLayout";

// TODO make email a constant
export function DmcaPage() {
  const { t } = useTranslation();

  return (
    <SubPageLayout>
      <ThinContainer>
        <Heading1>{t("screens.dmca.title")}</Heading1>
        <Paragraph>{t("screens.dmca.text")}</Paragraph>
        <Paragraph className="flex space-x-3 items-center">
          <Icon icon={Icons.MAIL} />
          <span>dmca@movie-web.app</span>
        </Paragraph>
      </ThinContainer>
    </SubPageLayout>
  );
}
