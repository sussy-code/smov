import classNames from "classnames";
import { useTranslation } from "react-i18next";

import { Icon, Icons } from "@/components/Icon";
import { useIsMobile } from "@/hooks/useIsMobile";

export function BrandPill(props: {
  clickable?: boolean;
  header?: boolean;
  backgroundClass?: string;
}) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div
      className={classNames(
        "flex items-center space-x-2 rounded-full px-4 py-2 text-type-logo",
        props.backgroundClass ?? "bg-pill-background bg-opacity-50",
        props.clickable
          ? "transition-[transform,background-color] hover:scale-105 hover:bg-pill-backgroundHover backdrop-blur-lg hover:text-type-logo active:scale-95"
          : "",
      )}
    >
      <Icon className="text-2xl" icon={Icons.MOVIE_WEB} />
      <span
        className={[
          "font-semibold text-white",
          isMobile && props.header ? "hidden sm:block" : "",
        ].join(" ")}
      >
        {t("global.name")}
      </span>
    </div>
  );
}
