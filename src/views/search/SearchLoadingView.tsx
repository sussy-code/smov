import { useTranslation } from "react-i18next";
import { Loading } from "@/components/layout/Loading";
import { useSearchQuery } from "@/hooks/useSearchQuery";

export function SearchLoadingView() {
  const { t } = useTranslation();
  const [query] = useSearchQuery();
  return (
    <Loading
      className="mt-40 mb-24 "
      text={
        t(`search.loading_${query.type}`) ||
        t("search.loading") ||
        "Fetching your favourite shows..."
      }
    />
  );
}
