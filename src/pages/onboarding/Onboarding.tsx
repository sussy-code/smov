import classNames from "classnames";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/buttons/Button";
import { Stepper } from "@/components/layout/Stepper";
import { CenterContainer } from "@/components/layout/ThinContainer";
import { Modal, ModalCard, useModal } from "@/components/overlays/Modal";
import { Heading1, Heading2, Paragraph } from "@/components/utils/Text";
import { MinimalPageLayout } from "@/pages/layouts/MinimalPageLayout";
import { useRedirectBack } from "@/pages/onboarding/onboardingHooks";
import { Card, CardContent, Link } from "@/pages/onboarding/utils";
import { PageTitle } from "@/pages/parts/util/PageTitle";

function VerticalLine(props: { className?: string }) {
  return (
    <div className={classNames("w-full grid justify-center", props.className)}>
      <div className="w-px h-10 bg-onboarding-divider" />
    </div>
  );
}

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
            <Heading1 className="!mt-0">Lorem ipsum</Heading1>
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
        <Heading2 className="!mt-0 !text-3xl max-w-[435px]">
          Let&apos;s get you set up with movie-web
        </Heading2>
        <Paragraph className="max-w-[320px]">
          To get the best streams possible, you will need to choose which
          streaming method you want to use.
        </Paragraph>

        <div className="w-full grid grid-cols-[1fr,auto,1fr] gap-3">
          <Card onClick={() => navigate("/onboarding/proxy")}>
            <CardContent
              colorClass="!text-onboarding-good"
              title="Custom proxy"
              subtitle="Good quality"
              description="Set up a proxy in only 5 minutes and gain access to great sources."
            >
              <Link>Set up proxy</Link>
            </CardContent>
          </Card>
          <div className="grid grid-rows-[1fr,auto,1fr] justify-center gap-4">
            <VerticalLine className="items-end" />
            <span className="text-xs uppercase font-bold">or</span>
            <VerticalLine />
          </div>
          <Card onClick={() => navigate("/onboarding/extension")}>
            <CardContent
              colorClass="!text-onboarding-best"
              title="Browser extension"
              subtitle="Best quality"
              description="Install browser extension and gain access to the best sources."
            >
              <Link>Install extension</Link>
            </CardContent>
          </Card>
        </div>

        <p className="text-center mt-12">
          I don&apos;t want good quality, <br />
          <a
            onClick={skipModal.show}
            type="button"
            className="text-onboarding-link hover:opacity-75 cursor-pointer"
          >
            use the default setup
          </a>
        </p>
      </CenterContainer>
    </MinimalPageLayout>
  );
}
