import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAsyncFn, useInterval } from "react-use";

import { isAllowedExtensionVersion } from "@/backend/extension/compatibility";
import { extensionInfo } from "@/backend/extension/messaging";
import { Button } from "@/components/buttons/Button";
import { Loading } from "@/components/layout/Loading";
import { Stepper } from "@/components/layout/Stepper";
import { CenterContainer } from "@/components/layout/ThinContainer";
import { Heading2, Paragraph } from "@/components/utils/Text";
import { MinimalPageLayout } from "@/pages/layouts/MinimalPageLayout";
import { useRedirectBack } from "@/pages/onboarding/onboardingHooks";
import { Card, Link } from "@/pages/onboarding/utils";
import { PageTitle } from "@/pages/parts/util/PageTitle";

type ExtensionStatus =
  | "unknown"
  | "failed"
  | "disallowed"
  | "noperms"
  | "outdated"
  | "success";

async function getExtensionState(): Promise<ExtensionStatus> {
  const info = await extensionInfo();
  if (!info) return "unknown"; // cant talk to extension
  if (!info.success) return "failed"; // extension failed to respond
  if (!info.allowed) return "disallowed"; // extension is not enabled on this page
  if (!info.hasPermission) return "noperms"; // extension has no perms to do it's tasks
  if (!isAllowedExtensionVersion(info.version)) return "outdated"; // extension is too old
  return "success"; // no problems
}

export function ExtensionStatus(props: {
  status: ExtensionStatus;
  loading: boolean;
}) {
  const { t } = useTranslation();

  let content: ReactNode = null;
  if (props.loading || props.status === "unknown")
    content = (
      <>
        <Loading />
        <p>{t("onboarding.extension.status.loading")}</p>
      </>
    );
  if (props.status === "disallowed")
    content = <p>{t("onboarding.extension.status.disallowed")}</p>;
  else if (props.status === "failed")
    content = <p>{t("onboarding.extension.status.failed")}</p>;
  else if (props.status === "outdated")
    content = <p>{t("onboarding.extension.status.outdated")}</p>;
  else if (props.status === "noperms")
    content = <p>{t("onboarding.extension.status.noperms")}</p>;
  else if (props.status === "success")
    content = <p>{t("onboarding.extension.status.success")}</p>;
  return (
    <Card>
      <div className="flex py-6 flex-col space-y-2 items-center justify-center">
        {content}
      </div>
    </Card>
  );
}

export function OnboardingExtensionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { completeAndRedirect } = useRedirectBack();

  const [{ loading, value }, exec] = useAsyncFn(
    async (triggeredManually: boolean = false) => {
      const status = await getExtensionState();
      if (status === "success" && triggeredManually) completeAndRedirect();
      return status;
    },
    [completeAndRedirect],
  );
  useInterval(exec, 1000);

  return (
    <MinimalPageLayout>
      <PageTitle subpage k="global.pages.onboarding" />
      <CenterContainer>
        <Stepper steps={2} current={2} className="mb-12" />
        <Heading2 className="!mt-0 !text-3xl max-w-[435px]">
          {t("onboarding.extension.title")}
        </Heading2>
        <Paragraph className="max-w-[320px] mb-4">
          {t("onboarding.extension.explainer")}
        </Paragraph>
        <Link href="https://google.com" target="_blank" className="mb-12">
          {t("onboarding.extension.link")}
        </Link>

        <ExtensionStatus status={value ?? "unknown"} loading={loading} />
        <div className="flex justify-between items-center mt-8">
          <Button onClick={() => navigate("/onboarding")} theme="secondary">
            {t("onboarding.extension.back")}
          </Button>
          <Button onClick={() => exec(true)} theme="purple">
            {t(
              value === "success"
                ? "onboarding.extension.submitFinal"
                : "onboarding.extension.submitCheck",
            )}
          </Button>
        </div>
      </CenterContainer>
    </MinimalPageLayout>
  );
}
