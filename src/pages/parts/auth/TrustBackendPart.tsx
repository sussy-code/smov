import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AsyncState } from "react-use/lib/useAsync";

import { MetaResponse } from "@/backend/accounts/meta";
import { Button } from "@/components/buttons/Button";
import { Icon, Icons } from "@/components/Icon";
import {
  LargeCard,
  LargeCardButtons,
  LargeCardText,
} from "@/components/layout/LargeCard";
import { Loading } from "@/components/layout/Loading";
import { MwLink } from "@/components/text/Link";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";

interface TrustBackendPartProps {
  result: AsyncState<MetaResponse | undefined>;
  onNext?: (meta: MetaResponse) => void;
}

export function TrustBackendPart(props: TrustBackendPartProps) {
  const navigate = useNavigate();
  const backendUrl = useBackendUrl();
  const hostname = useMemo(
    () => (backendUrl ? new URL(backendUrl).hostname : undefined),
    [backendUrl],
  );
  const { t } = useTranslation();

  let cardContent = (
    <>
      <h3 className="text-white font-bold text-lg">
        {t("auth.trust.failed.title")}
      </h3>
      <p>{t("auth.trust.failed.text")}</p>
    </>
  );

  if (!props.result.value) cardContent = <Loading />;
  else
    cardContent = (
      <>
        <h3 className="text-white font-bold text-lg">
          {props.result.value.name}
        </h3>
        {props.result.value.description ? (
          <p className="text-center">{props.result.value.description}</p>
        ) : null}
      </>
    );

  return (
    <LargeCard>
      <LargeCardText
        title={hostname ? t("auth.trust.title") : t("auth.trust.noHostTitle")}
        icon={<Icon icon={Icons.CIRCLE_EXCLAMATION} />}
      >
        {hostname ? (
          <Trans
            i18nKey="auth.trust.host"
            values={{
              hostname,
            }}
          >
            <span className="text-white" />
          </Trans>
        ) : (
          <p>{t("auth.trust.noHost")}</p>
        )}
      </LargeCardText>

      {hostname ? (
        <>
          <div className="border border-authentication-border rounded-xl px-4 py-8 flex flex-col items-center space-y-2 my-8">
            {cardContent}
          </div>
          <LargeCardButtons>
            <Button theme="secondary" onClick={() => navigate("/")}>
              {t("auth.trust.no")}
            </Button>
            <Button
              theme="purple"
              onClick={() =>
                props.result.value && props.onNext?.(props.result.value)
              }
            >
              {t("auth.trust.yes")}
            </Button>
          </LargeCardButtons>
          <p className="text-center mt-6">
            <Trans i18nKey="auth.hasAccount">
              <MwLink to="/login">.</MwLink>
            </Trans>
          </p>
        </>
      ) : (
        <LargeCardButtons>
          <Button theme="purple" onClick={() => navigate("/")}>
            {t("auth.trust.no")}
          </Button>
        </LargeCardButtons>
      )}
    </LargeCard>
  );
}
