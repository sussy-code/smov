import { useTranslation } from "react-i18next";

import { ButtonPlain } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { DisplayError } from "@/components/player/display/displayInterface";
import { Title } from "@/components/text/Title";
import { Paragraph } from "@/components/utils/Text";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";
import { ErrorCard } from "@/pages/parts/errors/ErrorCard";

export function ErrorPart(props: { error: any; errorInfo: any }) {
  const { t } = useTranslation();

  const maxLineCount = 5;
  const errorLines = (props.errorInfo.componentStack || "")
    .split("\n")
    .slice(0, maxLineCount);

  const error: DisplayError = {
    errorName: "What does this do",
    type: "global",
    message: errorLines.join("\n"),
  };

  return (
    <div className="relative flex flex-1 flex-col min-h-screen">
      <div className="flex h-full flex-1 flex-col items-center justify-center p-5 text-center">
        <ErrorLayout>
          <ErrorContainer maxWidth="max-w-2xl">
            <IconPill icon={Icons.EYE_SLASH}>{t("errors.badge")}</IconPill>
            <Title>{t("errors.title")}</Title>
            <Paragraph>{props.error.toString()}</Paragraph>
            <ErrorCard error={error} />
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
