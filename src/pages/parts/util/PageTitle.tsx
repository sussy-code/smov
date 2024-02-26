import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export interface PageTitleProps {
  k: string;
  subpage?: boolean;
}

export function PageTitle(props: PageTitleProps) {
  const { t } = useTranslation();

  const title = t(props.k);
  const subPageTitle = t("global.pages.pagetitle", { title });

  return (
    <Helmet>
      <title>{props.subpage ? subPageTitle : title}</title>
    </Helmet>
  );
}
