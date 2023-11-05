import { useAsync } from "react-use";

import { MetaResponse, getBackendMeta } from "@/backend/accounts/meta";
import { Button } from "@/components/Button";
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
    <div>
      <p>
        do you trust{" "}
        <span className="text-white font-bold">{result.value.domain}</span>
      </p>
      <div className="border rounded-xl p-4">
        <p className="text-white font-bold">{result.value.data.name}</p>
        {result.value.data.description ? (
          <p>{result.value.data.description}</p>
        ) : null}
      </div>
      <Button onClick={() => props.onNext?.(result.value.data)}>Next</Button>
    </div>
  );
}
