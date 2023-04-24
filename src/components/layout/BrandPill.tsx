import { useTranslation } from "react-i18next";

import { Icon, Icons } from "@/components/Icon";

export function BrandPill(props: {
  clickable?: boolean;
  hideTextOnMobile?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-center space-x-2 rounded-full bg-bink-300 bg-opacity-50 px-4 py-2 text-bink-600 ${
        props.clickable
          ? "transition-[transform,background-color] hover:scale-105 hover:bg-bink-400 hover:text-bink-700 active:scale-95"
          : ""
      }`}
    >
      <Icon className="text-xl" icon={Icons.MOVIE_WEB} />
      <span
        className={[
          "font-semibold text-white",
          props.hideTextOnMobile ? "hidden sm:block" : "",
        ].join(" ")}
      >
        {t("global.name")}
      </span>
    </div>
  );
}
