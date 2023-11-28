import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
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
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { conf } from "@/setup/config";

interface TrustBackendPartProps {
  onNext?: (meta: MetaResponse) => void;
}

export function TrustBackendPart(props: TrustBackendPartProps) {
  const history = useHistory();
  const backendUrl = useBackendUrl();
  const hostname = useMemo(() => new URL(backendUrl).hostname, [backendUrl]);
  const result = useAsync(() => {
    return getBackendMeta(conf().BACKEND_URL);
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
        {result.value.description ? <p>{result.value.description}</p> : null}
      </>
    );

  return (
    <LargeCard>
      <LargeCardText
        title={t("auth.trust.title")}
        icon={<Icon icon={Icons.CIRCLE_EXCLAMATION} />}
      >
        <Trans i18nKey="auth.trust.host">
          <span className="text-white">{{ hostname }}</span>
        </Trans>
      </LargeCardText>

      <div className="border border-authentication-border rounded-xl px-4 py-8 flex flex-col items-center space-y-2 my-8">
        {cardContent}
      </div>
      <LargeCardButtons>
        <Button
          theme="purple"
          onClick={() => result.value && props.onNext?.(result.value)}
        >
          {t("auth.trust.yes")}
        </Button>
        <Button theme="secondary" onClick={() => history.push("/")}>
          {t("auth.trust.no")}
        </Button>
      </LargeCardButtons>
    </LargeCard>
  );
}
