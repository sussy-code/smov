import { useTranslation } from "react-i18next";

import { Loading } from "@/components/layout/Loading";

export function SearchLoadingPart() {
  const { t } = useTranslation();
  return (
    <Loading
      className="mb-24 mt-40"
      text={t("home.search.loading") ?? undefined}
    />
  );
}
