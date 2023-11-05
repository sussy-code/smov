import { useState } from "react";
import { useAsyncFn } from "react-use";

import { Button } from "@/components/Button";
import { Input } from "@/components/player/internals/ContextMenu/Input";
import { useAuth } from "@/hooks/auth/useAuth";
import { AccountProfile } from "@/pages/parts/auth/AccountCreatePart";

interface VerifyPassphraseProps {
  mnemonic: string | null;
  userData: AccountProfile | null;
  onNext?: () => void;
}

export function VerifyPassphrase(props: VerifyPassphraseProps) {
  const [mnemonic, setMnemonic] = useState("");
  const { register, restore } = useAuth();

  const [result, execute] = useAsyncFn(
    async (inputMnemonic: string) => {
      if (!props.mnemonic || !props.userData)
        throw new Error("invalid input data");
      if (inputMnemonic !== props.mnemonic)
        throw new Error("Passphrase doesn't match");

      // TODO captcha?

      await register({
        mnemonic: inputMnemonic,
        userData: props.userData,
      });

      // TODO import (and sort out conflicts)

      await restore();

      props.onNext?.();
    },
    [props, register, restore]
  );

  return (
    <div>
      <p>verify passphrase</p>
      <Input value={mnemonic} onInput={setMnemonic} />
      {result.loading ? <p>Loading...</p> : null}
      {result.error ? <p>error: {result.error.toString()}</p> : null}
      <Button onClick={() => execute(mnemonic)}>Register</Button>
    </div>
  );
}
