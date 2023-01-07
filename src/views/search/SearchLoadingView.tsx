import { Loading } from "@/components/layout/Loading";
import { useTranslation } from "react-i18next";

export function SearchLoadingView() {
  const { t } = useTranslation();
  return (
    <Loading
      className="mt-40"
      text={t("search.loading") || "Fetching your favourite shows..."}
    />
  );
}
