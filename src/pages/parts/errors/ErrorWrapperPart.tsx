import { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import { Navigation } from "@/components/layout/Navigation";
import { useGoBack } from "@/hooks/useGoBack";
import { VideoPlayerHeader } from "@/video/components/parts/VideoPlayerHeader";

export function ErrorWrapperPart(props: {
  children?: ReactNode;
  video?: boolean;
}) {
  const { t } = useTranslation();
  const goBack = useGoBack();

  return (
    <div className="relative flex flex-1 flex-col">
      <Helmet>
        <title>{t("notFound.genericTitle")}</title>
      </Helmet>
      {props.video ? (
        <div className="absolute inset-x-0 top-0 px-8 py-6">
          <VideoPlayerHeader onClick={goBack} />
        </div>
      ) : (
        <Navigation />
      )}
      <div className="flex h-full flex-1 flex-col items-center justify-center p-5 text-center">
        {props.children}
      </div>
    </div>
  );
}
