import { useTranslation } from "react-i18next";

import { Icon, Icons } from "@/components/Icon";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { Heading1, Paragraph } from "@/components/utils/Text";
import { PageTitle } from "@/pages/parts/util/PageTitle";
import { conf } from "@/setup/config";

import { SubPageLayout } from "./layouts/SubPageLayout";

export function shouldHaveDmcaPage() {
  return !!conf().DMCA_EMAIL;
}

export function DmcaPage() {
  const { t } = useTranslation();

  return (
    <SubPageLayout>
      <PageTitle subpage k="global.pages.dmca" />
      <ThinContainer>
        <Heading1>{t("screens.dmca.title")}</Heading1>
        <Paragraph>{t("screens.dmca.text")}</Paragraph>
        <Paragraph className="flex space-x-3 items-center">
          <Icon icon={Icons.MAIL} />
          <span>{conf().DMCA_EMAIL ?? ""}</span>
        </Paragraph>
      </ThinContainer>
    </SubPageLayout>
  );
}
