import { ReactNode } from "react";
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
  let content: ReactNode = null;
  if (props.loading || props.status === "unknown")
    content = (
      <>
        <Loading />
        <p>waiting on extension</p>
      </>
    );
  if (props.status === "disallowed")
    content = <p>Extension disabled for this page</p>;
  else if (props.status === "failed") content = <p>Failed to request status</p>;
  else if (props.status === "outdated") content = <p>Extension too old</p>;
  else if (props.status === "noperms") content = <p>No permissions to act</p>;
  else if (props.status === "success") content = <p>Extension is working!</p>;
  return (
    <Card>
      <div className="flex py-6 flex-col space-y-2 items-center justify-center">
        {content}
      </div>
    </Card>
  );
}

export function OnboardingExtensionPage() {
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
      <PageTitle subpage k="global.pages.about" />
      <CenterContainer>
        <Stepper steps={2} current={2} className="mb-12" />
        <Heading2 className="!mt-0 !text-3xl max-w-[435px]">
          Let&apos;s start with an extension
        </Heading2>
        <Paragraph className="max-w-[320px] mb-4">
          Using the browser extension, you can get the best streams we have to
          offer. With just a simple install.
        </Paragraph>
        <Link href="https://google.com" target="_blank" className="mb-12">
          Install extension
        </Link>

        <ExtensionStatus status={value ?? "unknown"} loading={loading} />
        <div className="flex justify-between items-center mt-8">
          <Button onClick={() => navigate("/onboarding")} theme="secondary">
            Back
          </Button>
          <Button onClick={() => exec(true)} theme="purple">
            {value === "success" ? "Continue" : "Check extension"}{" "}
          </Button>
        </div>
      </CenterContainer>
    </MinimalPageLayout>
  );
}
