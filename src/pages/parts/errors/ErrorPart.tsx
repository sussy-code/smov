import { useTranslation } from "react-i18next";

import { ButtonPlain } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Title } from "@/components/text/Title";
import { Paragraph } from "@/components/utils/Text";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";

export function ErrorPart(props: { error: any; errorInfo: any }) {
  const data = JSON.stringify({
    error: props.error,
    errorInfo: props.errorInfo,
  });
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex h-full flex-1 flex-col items-center justify-center p-5 text-center">
        <ErrorLayout>
          <ErrorContainer>
            <IconPill icon={Icons.EYE_SLASH}>{t("errors.badge")}</IconPill>
            <Title>{t("errors.title")}</Title>
            <Paragraph>{data}</Paragraph>
            <ButtonPlain
              theme="purple"
              className="mt-6 md:px-12 p-2.5"
              onClick={() => window.location.reload()}
            >
              {t("errors.reloadPage")}
            </ButtonPlain>
          </ErrorContainer>
        </ErrorLayout>
      </div>
    </div>
  );
}
