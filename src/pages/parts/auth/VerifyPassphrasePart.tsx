import { useCallback, useEffect, useState } from "react";
import { GoogleReCaptcha, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useAsyncFn } from "react-use";

import { Button } from "@/components/Button";
import { Icon, Icons } from "@/components/Icon";
import {
  LargeCard,
  LargeCardButtons,
  LargeCardText,
} from "@/components/layout/LargeCard";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";
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

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [result, execute] = useAsyncFn(
    async (inputMnemonic: string) => {
      const recaptchaToken = executeRecaptcha
        ? await executeRecaptcha()
        : undefined;

      if (!props.mnemonic || !props.userData)
        throw new Error("Data is not valid");
      if (!recaptchaToken) throw new Error("ReCaptcha validation failed");
      if (inputMnemonic !== props.mnemonic)
        throw new Error("Passphrase doesn't match");

      // TODO captcha?

      await register({
        mnemonic: inputMnemonic,
        userData: props.userData,
        recaptchaToken,
      });

      // TODO import (and sort out conflicts)

      await restore();

      props.onNext?.();
    },
    [props, register, restore]
  );

  return (
    <LargeCard>
      <LargeCardText
        icon={<Icon icon={Icons.CIRCLE_CHECK} />}
        title="Enter your passphrase"
      >
        If you&apos;ve already lost it, how will you ever be able to take care
        of a child?
      </LargeCardText>
      <AuthInputBox
        label="Your passphrase"
        value={mnemonic}
        onChange={setMnemonic}
      />
      {result.error ? (
        <p className="mt-3 text-authentication-errorText">
          {result.error.message}
        </p>
      ) : null}
      <LargeCardButtons>
        <Button theme="purple" onClick={() => execute(mnemonic)}>
          Register
        </Button>
      </LargeCardButtons>
    </LargeCard>
  );
}
