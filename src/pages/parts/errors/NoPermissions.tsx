import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Navigation } from "@/components/layout/Navigation";
import { Title } from "@/components/text/Title";
import { Paragraph } from "@/components/utils/Text";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";

export function NoPermissions() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-1 flex-col">
      <Helmet>
        <title>{t("noPermissions.badge")}</title>
      </Helmet>
      <Navigation />
      <div className="flex h-full flex-1 flex-col items-center justify-center p-5 text-center">
        <ErrorLayout>
          <ErrorContainer>
            <IconPill icon={Icons.EYE_SLASH}>
              {t("noPermissions.badge")}
            </IconPill>
            <Title>{t("noPermissions.title")}</Title>
            <Paragraph>{t("noPermissions.message")}</Paragraph>
            <div className="flex gap-3">
              <Button href="/" theme="secondary" padding="md:px-12 p-2.5">
                {t("noPermissions.goHome")}
              </Button>
              <Button
                onClick={() => navigate("/login")}
                theme="purple"
                padding="md:px-12 p-2.5"
              >
                {t("noPermissions.loginButton")}
              </Button>
            </div>
          </ErrorContainer>
        </ErrorLayout>
      </div>
    </div>
  );
}
