import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Icon, Icons } from "@/components/Icon";

export function BackLink(props: { url: string }) {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div className="flex items-center">
      <span
        onClick={() => history.push(props.url)}
        className="flex items-center cursor-pointer text-type-secondary hover:text-white transition-colors duration-200 font-medium"
      >
        <Icon className="mr-2" icon={Icons.ARROW_LEFT} />
        <span className="md:hidden">{t("videoPlayer.backToHomeShort")}</span>
        <span className="hidden md:block">{t("videoPlayer.backToHome")}</span>
      </span>
    </div>
  );
}
