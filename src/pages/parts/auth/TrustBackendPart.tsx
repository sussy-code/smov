import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAsync } from "react-use";

import { MetaResponse, getBackendMeta } from "@/backend/accounts/meta";
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
  onNext?: (meta: MetaResponse) => void;
}

export function TrustBackendPart(props: TrustBackendPartProps) {
  const navigate = useNavigate();
  const backendUrl = useBackendUrl();
  const hostname = useMemo(() => new URL(backendUrl).hostname, [backendUrl]);
  const result = useAsync(() => {
    return getBackendMeta(backendUrl);
  }, [backendUrl]);
  const { t } = useTranslation();

  let cardContent = (
    <>
      <h3 className="text-white font-bold text-lg">
        {t("auth.trust.failed.title")}
      </h3>
      <p>{t("auth.trust.failed.text")}</p>
    </>
  );
  if (result.loading) cardContent = <Loading />;
  if (result.value)
    cardContent = (
      <>
        <h3 className="text-white font-bold text-lg">{result.value.name}</h3>
        {result.value.description ? (
          <p className="text-center">{result.value.description}</p>
        ) : null}
      </>
    );

  return (
    <LargeCard>
      <LargeCardText
        title={t("auth.trust.title")}
        icon={<Icon icon={Icons.CIRCLE_EXCLAMATION} />}
      >
        <Trans
          i18nKey="auth.trust.host"
          values={{
            hostname,
          }}
        >
          <span className="text-white" />
        </Trans>
      </LargeCardText>

      <div className="border border-authentication-border rounded-xl px-4 py-8 flex flex-col items-center space-y-2 my-8">
        {cardContent}
      </div>
      <LargeCardButtons>
        <Button theme="secondary" onClick={() => navigate("/")}>
          {t("auth.trust.no")}
        </Button>
        <Button
          theme="purple"
          onClick={() => result.value && props.onNext?.(result.value)}
        >
          {t("auth.trust.yes")}
        </Button>
      </LargeCardButtons>
      <p className="text-center mt-6">
        <Trans i18nKey="auth.hasAccount">
          <MwLink to="/login">.</MwLink>
        </Trans>
      </p>
    </LargeCard>
  );
}
