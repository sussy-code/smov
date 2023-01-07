import { Loading } from "@/components/layout/Loading";
import { useTranslation } from "react-i18next";

export function SearchLoadingView() {
  const { t } = useTranslation();
  return (
    <Loading
      className="my-24"
      text={t("search.loading") || "Fetching your favourite shows..."}
    />
  );
}
