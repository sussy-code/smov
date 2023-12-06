import { useTranslation } from "react-i18next";

import { ThinContainer } from "@/components/layout/ThinContainer";
import { Ol } from "@/components/utils/Ol";
import { Heading1, Heading2, Paragraph } from "@/components/utils/Text";
import { PageTitle } from "@/pages/parts/util/PageTitle";

import { SubPageLayout } from "./layouts/SubPageLayout";

function Question(props: { title: string; children: React.ReactNode }) {
  return (
    <>
      <p className="text-white mb-2 font-medium">{props.title}</p>
      <div className="text-type-text">{props.children}</div>
    </>
  );
}

export function AboutPage() {
  const { t } = useTranslation();
  return (
    <SubPageLayout>
      <PageTitle subpage k="global.pages.about" />
      <ThinContainer>
        <Heading1>{t("about.title")}</Heading1>
        <Paragraph>{t("about.description")}</Paragraph>
        <Heading2>{t("about.faqTitle")}</Heading2>
        <Ol
          items={[
            <Question title={t("about.q1.title")}>
              {t("about.q1.body")}
            </Question>,
            <Question title={t("about.q2.title")}>
              {t("about.q2.body")}
            </Question>,
            <Question title={t("about.q3.title")}>
              {t("about.q3.body")}
            </Question>,
          ]}
        />
      </ThinContainer>
    </SubPageLayout>
  );
}
