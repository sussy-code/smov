import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ButtonPlain } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Title } from "@/components/text/Title";
import { Paragraph } from "@/components/utils/Text";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";
import { ErrorCardInPlainModal } from "@/pages/parts/errors/ErrorCard";

export function ErrorPart(props: { error: any; errorInfo: any }) {
  const { t } = useTranslation();
  const [showErrorCard, setShowErrorCard] = useState(false);

  const maxLineCount = 5;
  const errorLines = (props.errorInfo.componentStack || "")
    .split("\n")
    .slice(0, maxLineCount);

  const error = `${props.error.toString()}\n${errorLines.join("\n")}`;

  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      <div className="flex h-full flex-1 flex-col items-center justify-center p-5 text-center">
        <ErrorLayout>
          <ErrorContainer maxWidth="max-w-2xl w-9/10">
            <IconPill icon={Icons.EYE_SLASH}>{t("errors.badge")}</IconPill>
            <Title>{t("errors.title")}</Title>

            <Paragraph>{props.error.toString()}</Paragraph>
            <ErrorCardInPlainModal
              show={showErrorCard}
              onClose={() => setShowErrorCard(false)}
              error={error}
            />

            <div className="flex gap-3">
              <ButtonPlain
                theme="secondary"
                className="mt-6 p-2.5 md:px-12"
                onClick={() => window.location.reload()}
              >
                {t("errors.reloadPage")}
              </ButtonPlain>
              <ButtonPlain
                theme="purple"
                className="mt-6 p-2.5 md:px-12"
                onClick={() => setShowErrorCard(true)}
              >
                {t("errors.showError")}
              </ButtonPlain>
            </div>
          </ErrorContainer>
        </ErrorLayout>
      </div>
    </div>
  );
}
