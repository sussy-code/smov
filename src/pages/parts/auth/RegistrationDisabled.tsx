import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/buttons/Button";
import { Icon, Icons } from "@/components/Icon";
import {
  LargeCard,
  LargeCardButtons,
  LargeCardText,
} from "@/components/layout/LargeCard";
import { MwLink } from "@/components/text/Link";

export function RegistrationDisabled() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <LargeCard>
      <LargeCardText
        className="mb-6"
        title={t("auth.disabled.title")}
        icon={<Icon icon={Icons.CIRCLE_EXCLAMATION} />}
      >
        <Trans i18nKey="auth.disabled.text">
          <span className="text-white" />
        </Trans>
      </LargeCardText>

      <>
        <LargeCardButtons className="mt-0">
          <Button theme="secondary" onClick={() => navigate("/")}>
            {t("auth.trust.no")}
          </Button>
        </LargeCardButtons>
        <p className="text-center mt-6">
          <Trans i18nKey="auth.hasAccount">
            <MwLink to="/login">.</MwLink>
          </Trans>
        </p>
      </>
    </LargeCard>
  );
}
