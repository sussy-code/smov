import { useTranslation } from "react-i18next";

import { ThinContainer } from "@/components/layout/ThinContainer";
import { Ol } from "@/components/utils/Ol";
import { Heading1, Heading2, Paragraph } from "@/components/utils/Text";

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
      <ThinContainer>
        <Heading1>{t("faq.title")}</Heading1>
        <Ol
          items={[
            <Question title={t("faq.q1.title")}>{t("faq.q1.body")}</Question>,
          ]}
        />
        <Heading2>{t("faq.how.title")}</Heading2>
        <Paragraph>{t("faq.how.body")}</Paragraph>
      </ThinContainer>
    </SubPageLayout>
  );
}
