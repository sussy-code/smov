import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SubPageLayout>
      <PageTitle subpage k="global.pages.dmca" />
      <ThinContainer>
        <Heading1>{t("screens.dmca.title")}</Heading1>
        <Paragraph>
          <Trans
            i18nKey="screens.dmca.text"
            components={{
              bold: <span className="font-bold text-white" />,
            }}
            values={{
              dmca: conf().DMCA_EMAIL,
            }}
          />
        </Paragraph>
        <Paragraph className="flex space-x-3 items-center">
          <Icon icon={Icons.MAIL} />
          <a
            href={`mailto:${conf().DMCA_EMAIL}`}
            style={{
              transition: "color 0.3s ease",
              color: isHovered ? "#ffffff" : "inherit",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {conf().DMCA_EMAIL ?? ""}
          </a>
        </Paragraph>
      </ThinContainer>
    </SubPageLayout>
  );
}
