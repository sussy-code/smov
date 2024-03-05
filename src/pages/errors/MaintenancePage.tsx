import { Helmet } from "react-helmet-async";
import { Trans, useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Navigation } from "@/components/layout/Navigation";
import { Title } from "@/components/text/Title";
import { Paragraph } from "@/components/utils/Text";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";

type MaintenancePageProps = {
  onHomeButtonClick: () => void;
};

function MaintenancePage({ onHomeButtonClick }: MaintenancePageProps) {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-1 flex-col">
      <Navigation />
      <Helmet>
        <title>{t("downtimeNotice.title")}</title>
      </Helmet>
      <div className="flex h-full flex-1 flex-col items-center justify-center p-5 text-center">
        <ErrorLayout>
          <ErrorContainer>
            <IconPill icon={Icons.WARNING}>
              {t("downtimeNotice.badge")}
            </IconPill>
            <Title>{t("downtimeNotice.title")}</Title>
            <Paragraph>{t("downtimeNotice.message")}</Paragraph>
            <Trans
              i18nKey="downtimeNotice.timeFrame"
              components={{
                bold: (
                  <span className="font-bold" style={{ color: "#cfcfcf" }} />
                ),
              }}
            />
            <div className="flex gap-3">
              <Button
                onClick={onHomeButtonClick}
                theme="purple"
                className="mt-6"
              >
                {t("downtimeNotice.goHome")}
              </Button>
            </div>
          </ErrorContainer>
        </ErrorLayout>
      </div>
    </div>
  );
}

export default MaintenancePage;
