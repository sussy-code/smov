import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/layout/ErrorBoundary";
import { useGoBack } from "@/hooks/useGoBack";
import { VideoPlayerHeader } from "@/video/components/parts/VideoPlayerHeader";

export function MediaFetchErrorView() {
  const { t } = useTranslation();
  const goBack = useGoBack();

  return (
    <div className="flex-1">
      <Helmet>
        <title>{t("media.errors.failedMeta")}</title>
      </Helmet>
      <div className="fixed inset-x-0 top-0 px-8 py-6">
        <VideoPlayerHeader onClick={goBack} />
      </div>
      <ErrorMessage>
        <p className="my-6 max-w-lg">{t("media.errors.mediaFailed")}</p>
      </ErrorMessage>
    </div>
  );
}
