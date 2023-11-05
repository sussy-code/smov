import { useState } from "react";
import { useAsyncFn } from "react-use";

import {
  getRegisterChallengeToken,
  registerAccount,
  signChallenge,
} from "@/backend/accounts/register";
import { Button } from "@/components/Button";
import { Input } from "@/components/player/internals/ContextMenu/Input";
import { AccountProfile } from "@/pages/parts/auth/AccountCreatePart";
import { conf } from "@/setup/config";
import { useAuthStore } from "@/stores/auth";

interface VerifyPassphraseProps {
  mnemonic: string | null;
  profile: AccountProfile | null;
  onNext?: () => void;
}

export function VerifyPassphrase(props: VerifyPassphraseProps) {
  const [mnemonic, setMnemonic] = useState("");
  const setAccount = useAuthStore((s) => s.setAccount);

  const [result, execute] = useAsyncFn(
    async (inputMnemonic: string) => {
      if (!props.mnemonic || !props.profile)
        throw new Error("invalid input data");
      if (inputMnemonic !== props.mnemonic)
        throw new Error("Passphrase doesn't match");
      const url = conf().BACKEND_URL;

      // TODO captcha?
      const { challenge } = await getRegisterChallengeToken(url);
      const keys = await signChallenge(inputMnemonic, challenge);
      const registerResult = await registerAccount(url, {
        challenge: {
          code: challenge,
          signature: keys.signature,
        },
        publicKey: keys.publicKey,
        device: props.profile.device,
        profile: props.profile.profile,
      });

      setAccount({
        profile: registerResult.user.profile,
        sessionId: registerResult.session.id,
        token: registerResult.token,
        userId: registerResult.user.id,
      });

      props.onNext?.();
    },
    [props, setAccount]
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
