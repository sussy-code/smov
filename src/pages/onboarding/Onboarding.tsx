import { useNavigate } from "react-router-dom";

import { Button } from "@/components/buttons/Button";
import { Stepper } from "@/components/layout/Stepper";
import { CenterContainer } from "@/components/layout/ThinContainer";
import { Modal, ModalCard, useModal } from "@/components/overlays/Modal";
import { Heading2, Paragraph } from "@/components/utils/Text";
import { MinimalPageLayout } from "@/pages/layouts/MinimalPageLayout";
import { useRedirectBack } from "@/pages/onboarding/onboardingHooks";
import { PageTitle } from "@/pages/parts/util/PageTitle";

export function OnboardingPage() {
  const navigate = useNavigate();
  const skipModal = useModal("skip");
  const { completeAndRedirect } = useRedirectBack();

  return (
    <MinimalPageLayout>
      <PageTitle subpage k="global.pages.about" />
      <Modal id={skipModal.id}>
        <ModalCard>
          <ModalCard>
            <Heading2 className="!mt-0">Lorem ipsum</Heading2>
            <Paragraph>Lorem ipsum Lorem ipsum Lorem ipsum</Paragraph>
            <Button theme="secondary" onClick={skipModal.hide}>
              Lorem ipsum
            </Button>
            <Button theme="danger" onClick={() => completeAndRedirect()}>
              Lorem ipsum
            </Button>
          </ModalCard>
        </ModalCard>
      </Modal>
      <CenterContainer>
        <Stepper steps={2} current={1} className="mb-12" />
        <Heading2 className="!mt-0">Lorem ipsum</Heading2>
        <Paragraph>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</Paragraph>
        <Button onClick={() => navigate("/onboarding/proxy")}>
          Custom proxy
        </Button>
        <Button onClick={() => navigate("/onboarding/extension")}>
          Extension
        </Button>
        <Button onClick={skipModal.show}>Default</Button>
      </CenterContainer>
    </MinimalPageLayout>
  );
}
