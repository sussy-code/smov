import { useCallback, useState } from "react";

import { Button } from "@/components/Button";
import { Toggle } from "@/components/buttons/Toggle";
import { Icon, Icons } from "@/components/Icon";
import { SettingsCard } from "@/components/layout/SettingsCard";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";
import { Divider } from "@/components/utils/Divider";
import { Heading1 } from "@/components/utils/Text";

let idNum = 0;

interface ProxyItem {
  url: string;
  id: number;
}

function ProxyEdit() {
  const [customWorkers, setCustomWorkers] = useState<ProxyItem[] | null>(null);

  const add = useCallback(() => {
    idNum += 1;
    setCustomWorkers((s) => [
      ...(s ?? []),
      {
        id: idNum,
        url: "",
      },
    ]);
  }, [setCustomWorkers]);

  const changeItem = useCallback(
    (id: number, val: string) => {
      setCustomWorkers((s) => [
        ...(s ?? []).map((v) => {
          if (v.id !== id) return v;
          v.url = val;
          return v;
        }),
      ]);
    },
    [setCustomWorkers]
  );

  const removeItem = useCallback(
    (id: number) => {
      setCustomWorkers((s) => [...(s ?? []).filter((v) => v.id !== id)]);
    },
    [setCustomWorkers]
  );

  return (
    <SettingsCard>
      <div className="flex justify-between items-center">
        <div className="my-3">
          <p className="text-white font-bold mb-3">Use custom proxy workers</p>
          <p className="max-w-[20rem] font-medium">
            To make the application function, all traffic is routed through
            proxies. Enable this if you want to bring your own workers.
          </p>
        </div>
        <div>
          <Toggle
            onClick={() => setCustomWorkers((s) => (s === null ? [] : null))}
            enabled={customWorkers !== null}
          />
        </div>
      </div>
      {customWorkers !== null ? (
        <>
          <Divider marginClass="my-6 px-8 box-content -mx-8" />
          <p className="text-white font-bold mb-3">Worker URLs</p>

          <div className="my-6 space-y-2 max-w-md">
            {(customWorkers?.length ?? 0) === 0 ? (
              <p>No workers yet, add one below</p>
            ) : null}
            {(customWorkers ?? []).map((v) => (
              <div className="grid grid-cols-[1fr,auto] items-center gap-2">
                <AuthInputBox
                  value={v.url}
                  onChange={(val) => changeItem(v.id, val)}
                  placeholder="https://"
                />
                <button
                  type="button"
                  onClick={() => removeItem(v.id)}
                  className="h-full scale-90 hover:scale-100 rounded-full aspect-square bg-authentication-inputBg hover:bg-authentication-inputBgHover flex justify-center items-center transition-transform duration-200 hover:text-white cursor-pointer"
                >
                  <Icon className="text-xl" icon={Icons.X} />
                </button>
              </div>
            ))}
          </div>

          <Button theme="purple" onClick={add}>
            Add new worker
          </Button>
        </>
      ) : null}
    </SettingsCard>
  );
}

function BackendEdit() {
  const [customBackendUrl, setCustomBackendUrl] = useState<string | null>(null);

  return (
    <SettingsCard>
      <div className="flex justify-between items-center">
        <div className="my-3">
          <p className="text-white font-bold mb-3">Custom server</p>
          <p className="max-w-[20rem] font-medium">
            To make the application function, all traffic is routed through
            proxies. Enable this if you want to bring your own workers.
          </p>
        </div>
        <div>
          <Toggle
            onClick={() => setCustomBackendUrl((s) => (s === null ? "" : null))}
            enabled={customBackendUrl !== null}
          />
        </div>
      </div>
      {customBackendUrl !== null ? (
        <>
          <Divider marginClass="my-6 px-8 box-content -mx-8" />
          <p className="text-white font-bold mb-3">Custom server URL</p>
          <AuthInputBox
            onChange={setCustomBackendUrl}
            value={customBackendUrl ?? ""}
          />
        </>
      ) : null}
    </SettingsCard>
  );
}

export function ConnectionsPart() {
  return (
    <div>
      <Heading1 border>Connections</Heading1>
      <div className="space-y-6">
        <ProxyEdit />
        <BackendEdit />
      </div>
    </div>
  );
}
