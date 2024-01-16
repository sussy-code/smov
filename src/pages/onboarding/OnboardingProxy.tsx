import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";

import { singularProxiedFetch } from "@/backend/helpers/fetch";
import { Button } from "@/components/buttons/Button";
import { Stepper } from "@/components/layout/Stepper";
import { CenterContainer } from "@/components/layout/ThinContainer";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";
import { Heading2, Paragraph } from "@/components/utils/Text";
import { MinimalPageLayout } from "@/pages/layouts/MinimalPageLayout";
import { useRedirectBack } from "@/pages/onboarding/onboardingHooks";
import { PageTitle } from "@/pages/parts/util/PageTitle";
import { useAuthStore } from "@/stores/auth";

const testUrl = "https://postman-echo.com/get";

export function OnboardingProxyPage() {
  const navigate = useNavigate();
  const { completeAndRedirect } = useRedirectBack();
  const [url, setUrl] = useState("");
  const setProxySet = useAuthStore((s) => s.setProxySet);

  const [{ loading, error }, test] = useAsyncFn(async () => {
    if (!url.startsWith("http")) throw new Error("Not a valid URL");
    const res = await singularProxiedFetch(url, testUrl, {});
    if (res.url !== testUrl) throw new Error("Not a proxy");
    setProxySet([url]);
    completeAndRedirect();
  }, [url, completeAndRedirect, setProxySet]);

  return (
    <MinimalPageLayout>
      <PageTitle subpage k="global.pages.about" />
      <CenterContainer>
        <Stepper steps={2} current={2} className="mb-12" />
        <Heading2 className="!mt-0">Lorem ipsum</Heading2>
        <Paragraph>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</Paragraph>
        <AuthInputBox value={url} onChange={setUrl} placeholder="lorem ipsum" />
        {error ? <p>url invalid</p> : null}
        <Button onClick={() => navigate("/onboarding")} loading={loading}>
          Backagd
        </Button>
        <Button onClick={test}>Submit proxy</Button>
      </CenterContainer>
    </MinimalPageLayout>
  );
}
