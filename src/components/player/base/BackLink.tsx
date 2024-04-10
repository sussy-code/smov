import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Icon, Icons } from "@/components/Icon";

export function BackLink(props: { url: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center">
      <Link
        to={props.url}
        className="py-1 -my-1 px-2 -mx-2 tabbable rounded-lg flex items-center cursor-pointer text-type-secondary hover:text-white transition-colors duration-200 font-medium"
      >
        <Icon className="mr-2" icon={Icons.ARROW_LEFT} />
        <span className="md:hidden">{t("player.back.short")}</span>
        <span className="hidden md:block">{t("player.back.default")}</span>
      </Link>
    </div>
  );
}
