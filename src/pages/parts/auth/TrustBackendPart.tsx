import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useAsync } from "react-use";

import { MetaResponse, getBackendMeta } from "@/backend/accounts/meta";
import { Button } from "@/components/Button";
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
  const backendHostname = useMemo(
    () => new URL(backendUrl).hostname,
    [backendUrl]
  );
  const result = useAsync(() => {
    return getBackendMeta(conf().BACKEND_URL);
  }, [backendUrl]);

  let cardContent = (
    <>
      <h3 className="text-white font-bold text-lg">Failed to reach backend</h3>
      <p>Did you configure it correctly?</p>
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
        title="Do you trust this host?"
        icon={<Icon icon={Icons.CIRCLE_EXCLAMATION} />}
      >
        Do you trust <span className="text-white">{backendHostname}</span>?
      </LargeCardText>

      <div className="border border-authentication-border rounded-xl px-4 py-8 flex flex-col items-center space-y-2 my-8">
        {cardContent}
      </div>
      <LargeCardButtons>
        <Button
          theme="purple"
          onClick={() => result.value && props.onNext?.(result.value)}
        >
          I pledge my life to the United States
        </Button>
        <Button theme="secondary" onClick={() => history.push("/")}>
          I WILL NEVER SUCCUMB!
        </Button>
      </LargeCardButtons>
    </LargeCard>
  );
}
