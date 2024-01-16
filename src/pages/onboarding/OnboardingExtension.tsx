import { useNavigate } from "react-router-dom";

import { Button } from "@/components/buttons/Button";
import { Stepper } from "@/components/layout/Stepper";
import { CenterContainer } from "@/components/layout/ThinContainer";
import { Heading2, Paragraph } from "@/components/utils/Text";
import { MinimalPageLayout } from "@/pages/layouts/MinimalPageLayout";
import { PageTitle } from "@/pages/parts/util/PageTitle";

export function OnboardingExtensionPage() {
  const navigate = useNavigate();

  return (
    <MinimalPageLayout>
      <PageTitle subpage k="global.pages.about" />
      <CenterContainer>
        <Stepper steps={2} current={2} className="mb-12" />
        <Heading2 className="!mt-0">Lorem ipsum</Heading2>
        <Paragraph>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</Paragraph>
        <Button onClick={() => navigate("/onboarding")}>Back</Button>
        <Button onClick={() => alert("Check extension here or something")}>
          Check extension
        </Button>
      </CenterContainer>
    </MinimalPageLayout>
  );
}
