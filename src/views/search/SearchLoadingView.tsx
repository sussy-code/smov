import { useTranslation } from "react-i18next";

import { Loading } from "@/components/layout/Loading";
import { useSearchQuery } from "@/hooks/useSearchQuery";

export function SearchLoadingView() {
  const { t } = useTranslation();
  const [query] = useSearchQuery();
  return (
    <Loading
      className="mb-24 mt-40 "
      text={
        t(`search.loading_${query.type}`) ||
        t("search.loading") ||
        "Fetching your favourite shows..."
      }
    />
  );
}
