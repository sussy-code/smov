import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Icon, Icons } from "@/components/Icon";

export function BackLink(props: { url: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Check if center mouse button is clicked
    if (event.button === 1) {
      // Open the URL in a new tab
      window.open(props.url, "_blank");
    } else {
      // Navigate normally for other clicks
      navigate(props.url);
    }
  };
  return (
    <div className="flex items-center">
      <button
        type="button"
        onContextMenu={(e) => e.preventDefault()}
        onMouseUp={handleClick}
        className="py-1 -my-1 px-2 -mx-2 tabbable rounded-lg flex items-center cursor-pointer text-type-secondary hover:text-white transition-colors duration-200 font-medium"
      >
        <Icon className="mr-2" icon={Icons.ARROW_LEFT} />
        <span className="md:hidden">{t("player.back.short")}</span>
        <span className="hidden md:block">{t("player.back.default")}</span>
      </button>
    </div>
  );
}
