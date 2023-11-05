import { useState } from "react";
import { useAsyncFn } from "react-use";

import { verifyValidMnemonic } from "@/backend/accounts/crypto";
import { Button } from "@/components/Button";
import { Input } from "@/components/player/internals/ContextMenu/Input";
import { useAuth } from "@/hooks/auth/useAuth";

interface LoginFormPartProps {
  onLogin?: () => void;
}

export function LoginFormPart(props: LoginFormPartProps) {
  const [mnemonic, setMnemonic] = useState("");
  const [device, setDevice] = useState("");
  const { login, restore } = useAuth();

  const [result, execute] = useAsyncFn(
    async (inputMnemonic: string, inputdevice: string) => {
      // TODO verify valid device input
      if (!verifyValidMnemonic(inputMnemonic))
        throw new Error("Invalid or incomplete passphrase");

      // TODO captcha?
      await login({
        mnemonic: inputMnemonic,
        userData: {
          device: inputdevice,
        },
      });

      // TODO import (and sort out conflicts)

      await restore();

      props.onLogin?.();
    },
    [props, login, restore]
  );

  return (
    <div>
      <p>passphrase</p>
      <Input value={mnemonic} onInput={setMnemonic} />
      <p>Device name</p>
      <Input value={device} onInput={setDevice} />
      {result.loading ? <p>Loading...</p> : null}
      {result.error ? <p>error: {result.error.toString()}</p> : null}
      <Button onClick={() => execute(mnemonic, device)}>Login</Button>
    </div>
  );
}
