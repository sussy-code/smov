import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Icons } from "@/components/Icon";
import { Stepper } from "@/components/layout/Stepper";
import { CenterContainer } from "@/components/layout/ThinContainer";
import { VerticalLine } from "@/components/layout/VerticalLine";
import { Heading2, Paragraph } from "@/components/utils/Text";
import { MinimalPageLayout } from "@/pages/layouts/MinimalPageLayout";
import { Card, CardContent, Link } from "@/pages/migration/utils";
import { PageTitle } from "@/pages/parts/util/PageTitle";

export function MigrationPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <MinimalPageLayout>
      <PageTitle subpage k="global.pages.migration" />
      <CenterContainer>
        <Stepper steps={2} current={1} className="mb-12" />
        <Heading2 className="!mt-0 !text-3xl max-w-[435px]">
          {t("migration.start.title")}
        </Heading2>
        <Paragraph className="max-w-[320px]">
          {t("migration.start.explainer")}
        </Paragraph>

        <div className="w-full flex flex-col md:flex-row gap-3">
          <Card onClick={() => navigate("/migration/direct")}>
            <CardContent
              colorClass="!text-onboarding-best"
              title={t("migration.start.options.direct.title")}
              subtitle={t("migration.start.options.direct.quality")}
              description={
                <Trans i18nKey="migration.start.options.direct.description" />
              }
              icon={Icons.CLOUD_ARROW_UP}
            >
              <Link>{t("migration.start.options.direct.action")}</Link>
            </CardContent>
          </Card>
          <div className="hidden md:grid grid-rows-[1fr,auto,1fr] justify-center gap-4">
            <VerticalLine className="items-end" />
            <span className="text-xs uppercase font-bold">
              {t("migration.start.options.or")}
            </span>
            <VerticalLine />
          </div>
          <Card onClick={() => navigate("/migration/download")}>
            <CardContent
              colorClass="!text-migration-good"
              title={t("migration.start.options.download.title")}
              subtitle={t("migration.start.options.download.quality")}
              description={t("migration.start.options.download.description")}
              icon={Icons.FILE_ARROW_DOWN}
            >
              <Link>{t("migration.start.options.download.action")}</Link>
            </CardContent>
          </Card>
        </div>
      </CenterContainer>
    </MinimalPageLayout>
  );
}
