import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Button } from "@/components/buttons/Button";
import { SolidSettingsCard } from "@/components/layout/SettingsCard";
import { Heading3 } from "@/components/utils/Text";

export function RegisterCalloutPart() {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div>
      <SolidSettingsCard
        paddingClass="px-6 py-12"
        className="grid grid-cols-2 gap-12 mt-5"
      >
        <div>
          <Heading3>{t("settings.account.register.title")}</Heading3>
          <p className="text-type-text">
            {t("settings.account.register.text")}
          </p>
        </div>
        <div className="flex justify-end items-center">
          <Button theme="purple" onClick={() => history.push("/register")}>
            {t("settings.account.register.cta")}
          </Button>
        </div>
      </SolidSettingsCard>
    </div>
  );
}
