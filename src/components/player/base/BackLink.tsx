import { useTranslation } from "react-i18next";

import { Icon, Icons } from "@/components/Icon";
import { useGoBack } from "@/hooks/useGoBack";

export function BackLink() {
  const { t } = useTranslation();
  const goBack = useGoBack();

  return (
    <div className="flex items-center">
      <span
        onClick={() => goBack()}
        className="flex items-center cursor-pointer text-type-secondary hover:text-white transition-colors duration-200 font-medium"
      >
        <Icon className="mr-2" icon={Icons.ARROW_LEFT} />
        <span>{t("videoPlayer.backToHomeShort")}</span>
      </span>
    </div>
  );
}
