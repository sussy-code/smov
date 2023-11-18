import { useAsyncFn } from "react-use";

import { SessionResponse } from "@/backend/accounts/auth";
import { base64ToBuffer, decryptData } from "@/backend/accounts/crypto";
import { removeSession } from "@/backend/accounts/sessions";
import { Button } from "@/components/Button";
import { Loading } from "@/components/layout/Loading";
import { SettingsCard } from "@/components/layout/SettingsCard";
import { SecondaryLabel } from "@/components/text/SecondaryLabel";
import { Heading2 } from "@/components/utils/Text";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { useAuthStore } from "@/stores/auth";

export function Device(props: {
  name: string;
  id: string;
  isCurrent?: boolean;
  onRemove?: () => void;
}) {
  const url = useBackendUrl();
  const token = useAuthStore((s) => s.account?.token);
  const [result, exec] = useAsyncFn(async () => {
    if (!token) throw new Error("No token present");
    await removeSession(url, token, props.id);
    props.onRemove?.();
  }, [url, token, props.id]);

  return (
    <SettingsCard
      className="flex justify-between items-center"
      paddingClass="px-6 py-4"
    >
      <div className="font-medium">
        <SecondaryLabel>Device name</SecondaryLabel>
        <p className="text-white">{props.name}</p>
      </div>
      {!props.isCurrent ? (
        <Button theme="danger" loading={result.loading} onClick={exec}>
          Remove
        </Button>
      ) : null}
    </SettingsCard>
  );
}

export function DeviceListPart(props: {
  loading?: boolean;
  error?: boolean;
  sessions: SessionResponse[];
  onChange?: () => void;
}) {
  const seed = useAuthStore((s) => s.account?.seed);
  const currentSessionId = useAuthStore((s) => s.account?.sessionId);
  if (!seed) return null;

  return (
    <div>
      <Heading2 border className="mt-0 mb-9">
        Devices
      </Heading2>
      {props.error ? (
        <p>Failed to load sessions</p>
      ) : props.loading ? (
        <Loading />
      ) : (
        <div className="space-y-5">
          {props.sessions.map((session) => {
            const decryptedName = decryptData(
              session.device,
              base64ToBuffer(seed)
            );
            return (
              <Device
                name={decryptedName}
                id={session.id}
                key={session.id}
                isCurrent={session.id === currentSessionId}
                onRemove={props.onChange}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
