import { useCallback, useState } from "react";

import { Button } from "@/components/Button";
import { Input } from "@/components/player/internals/ContextMenu/Input";

export interface AccountProfile {
  device: string;
  account: string;
  profile: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

interface AccountCreatePartProps {
  onNext?: (data: AccountProfile) => void;
}

export function AccountCreatePart(props: AccountCreatePartProps) {
  const [account, setAccount] = useState("");
  const [device, setDevice] = useState("");
  // TODO validate device and account before next step

  const nextStep = useCallback(() => {
    props.onNext?.({
      account,
      device,
      profile: {
        colorA: "#fff",
        colorB: "#000",
        icon: "brush",
      },
    });
  }, [account, device, props]);

  return (
    <div>
      <p>Account name</p>
      <Input value={account} onInput={setAccount} />
      <p>Device name</p>
      <Input value={device} onInput={setDevice} />
      <Button onClick={() => nextStep()}>Next</Button>
    </div>
  );
}
