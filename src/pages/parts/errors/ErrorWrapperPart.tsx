import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { Navigation } from "@/components/layout/Navigation";

export function ErrorWrapperPart(props: { children?: ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-1 flex-col">
      <Helmet>
        <title>{t("notFound.genericTitle")}</title>
      </Helmet>
      <Navigation />
      <div className="flex h-full flex-1 flex-col items-center justify-center p-5 text-center">
        {props.children}
      </div>
    </div>
  );
}
