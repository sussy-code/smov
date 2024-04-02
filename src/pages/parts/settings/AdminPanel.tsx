import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/buttons/Button";
import { SolidSettingsCard } from "@/components/layout/SettingsCard";
import { Heading3 } from "@/components/utils/Text";

export function AdminPanelPart() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      <SolidSettingsCard
        paddingClass="px-6 py-12"
        className="grid grid-cols-2 gap-12 mt-5"
      >
        <div>
          <Heading3>{t("settings.account.admin.title")}</Heading3>
          <p className="text-type-text">{t("settings.account.admin.text")}</p>
        </div>
        <div className="flex justify-end items-center">
          <Button theme="purple" onClick={() => navigate("/admin")}>
            {t("settings.account.admin.button")}
          </Button>
        </div>
      </SolidSettingsCard>
    </div>
  );
}
