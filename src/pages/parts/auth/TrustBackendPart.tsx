import { useAsync } from "react-use";

import { MetaResponse, getBackendMeta } from "@/backend/accounts/meta";
import { Button } from "@/components/Button";
import { Icon, Icons } from "@/components/Icon";
import {
  LargeCard,
  LargeCardButtons,
  LargeCardText,
} from "@/components/layout/LargeCard";
import { conf } from "@/setup/config";

interface TrustBackendPartProps {
  onNext?: (meta: MetaResponse) => void;
}

export function TrustBackendPart(props: TrustBackendPartProps) {
  const result = useAsync(async () => {
    const url = conf().BACKEND_URL;
    return {
      domain: new URL(url).hostname,
      data: await getBackendMeta(conf().BACKEND_URL),
    };
  }, []);

  if (result.loading) return <p>loading...</p>;

  if (result.error || !result.value)
    return <p>Failed to talk to backend, did you configure it correctly?</p>;

  return (
    <LargeCard>
      <LargeCardText
        title="Do you trust this host?"
        icon={<Icon icon={Icons.CIRCLE_EXCLAMATION} />}
      >
        Do you trust <span className="text-white">{result.value.domain}</span>?
      </LargeCardText>

      <div className="border border-authentication-border rounded-xl px-4 py-8 flex flex-col items-center space-y-2 my-8">
        <h3 className="text-white font-bold text-lg">
          {result.value.data.name}
        </h3>
        {result.value.data.description ? (
          <p>{result.value.data.description}</p>
        ) : null}
      </div>
      <LargeCardButtons>
        <Button
          theme="purple"
          onClick={() => props.onNext?.(result.value.data)}
        >
          I pledge my life to the United States
        </Button>
        <Button
          theme="secondary"
          // eslint-disable-next-line no-return-assign, no-restricted-globals
          onClick={() => (location.href = "https://youtu.be/of0O-lS-OqQ")}
        >
          I WILL NEVER SUCCUMB!
        </Button>
      </LargeCardButtons>
    </LargeCard>
  );
}
