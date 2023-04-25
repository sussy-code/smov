import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Banner } from "@/components/Banner";
import { useBannerSize } from "@/hooks/useBanner";
import { useIsOnline } from "@/hooks/usePing";

export function Layout(props: { children: ReactNode }) {
  const { t } = useTranslation();
  const isOnline = useIsOnline();
  const bannerSize = useBannerSize();

  return (
    <div>
      <div className="fixed inset-x-0 z-[1000]">
        {!isOnline ? <Banner type="error">{t("errors.offline")}</Banner> : null}
      </div>
      <div
        style={{
          paddingTop: `${bannerSize}px`,
        }}
        className="flex min-h-screen flex-col"
      >
        {props.children}
      </div>
    </div>
  );
}
