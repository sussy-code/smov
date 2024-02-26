import classNames from "classnames";
import { Trans, useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Stepper } from "@/components/layout/Stepper";
import { CenterContainer } from "@/components/layout/ThinContainer";
import { Modal, ModalCard, useModal } from "@/components/overlays/Modal";
import { Heading1, Heading2, Paragraph } from "@/components/utils/Text";
import { MinimalPageLayout } from "@/pages/layouts/MinimalPageLayout";
import {
  useNavigateOnboarding,
  useRedirectBack,
} from "@/pages/onboarding/onboardingHooks";
import { Card, CardContent, Link } from "@/pages/onboarding/utils";
import { PageTitle } from "@/pages/parts/util/PageTitle";
import { getProxyUrls } from "@/utils/proxyUrls";

function VerticalLine(props: { className?: string }) {
  return (
    <div className={classNames("w-full grid justify-center", props.className)}>
      <div className="w-px h-10 bg-onboarding-divider" />
    </div>
  );
}

export function OnboardingPage() {
  const navigate = useNavigateOnboarding();
  const skipModal = useModal("skip");
  const { completeAndRedirect } = useRedirectBack();
  const { t } = useTranslation();
  const noProxies = getProxyUrls().length === 0;

  return (
    <MinimalPageLayout>
      <PageTitle subpage k="global.pages.onboarding" />
      <Modal id={skipModal.id}>
        <ModalCard>
          <Heading1 className="!mt-0 !mb-4 !text-2xl">
            {t("onboarding.defaultConfirm.title")}
          </Heading1>
          <Paragraph className="!mt-1 !mb-12">
            {t("onboarding.defaultConfirm.description")}
          </Paragraph>
          <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-between">
            <Button theme="secondary" onClick={skipModal.hide}>
              {t("onboarding.defaultConfirm.cancel")}
            </Button>
            <Button theme="purple" onClick={() => completeAndRedirect()}>
              {t("onboarding.defaultConfirm.confirm")}
            </Button>
          </div>
        </ModalCard>
      </Modal>
      <CenterContainer>
        <Stepper steps={2} current={1} className="mb-12" />
        <Heading2 className="!mt-0 !text-3xl max-w-[435px]">
          {t("onboarding.start.title")}
        </Heading2>
        <Paragraph className="max-w-[320px]">
          {t("onboarding.start.explainer")}
        </Paragraph>

        <div className="w-full flex flex-col md:flex-row gap-3">
          <Card onClick={() => navigate("/onboarding/extension")}>
            <CardContent
              colorClass="!text-onboarding-best"
              title={t("onboarding.start.options.extension.title")}
              subtitle={t("onboarding.start.options.extension.quality")}
              description={t("onboarding.start.options.extension.description")}
            >
              <Link>{t("onboarding.start.options.extension.action")}</Link>
            </CardContent>
          </Card>
          <div className="hidden md:grid grid-rows-[1fr,auto,1fr] justify-center gap-4">
            <VerticalLine className="items-end" />
            <span className="text-xs uppercase font-bold">or</span>
            <VerticalLine />
          </div>
          <Card onClick={() => navigate("/onboarding/proxy")}>
            <CardContent
              colorClass="!text-onboarding-good"
              title={t("onboarding.start.options.proxy.title")}
              subtitle={t("onboarding.start.options.proxy.quality")}
              description={t("onboarding.start.options.proxy.description")}
            >
              <Link>{t("onboarding.start.options.proxy.action")}</Link>
            </CardContent>
          </Card>
        </div>
        {noProxies ? null : (
          <>
            <p className="text-center hidden md:block mt-12">
              <Trans i18nKey="onboarding.start.options.default.text">
                <br />
                <a
                  onClick={skipModal.show}
                  type="button"
                  className="text-onboarding-link hover:opacity-75 cursor-pointer"
                />
              </Trans>
            </p>
            <div className=" max-w-[300px] mx-auto md:hidden mt-12 ">
              <Button
                className="!text-type-text !bg-opacity-50"
                theme="secondary"
                onClick={skipModal.show}
              >
                <span>
                  <Trans i18nKey="onboarding.start.options.default.text">
                    <span />
                    <span />
                  </Trans>
                </span>
              </Button>
            </div>
          </>
        )}
      </CenterContainer>
    </MinimalPageLayout>
  );
}
