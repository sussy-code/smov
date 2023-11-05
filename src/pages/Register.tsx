import { useState } from "react";

import { SubPageLayout } from "@/pages/layouts/SubPageLayout";
import {
  AccountCreatePart,
  AccountProfile,
} from "@/pages/parts/auth/AccountCreatePart";
import { PassphraseGeneratePart } from "@/pages/parts/auth/PassphraseGeneratePart";
import { TrustBackendPart } from "@/pages/parts/auth/TrustBackendPart";
import { VerifyPassphrase } from "@/pages/parts/auth/VerifyPassphrasePart";

export function RegisterPage() {
  const [step, setStep] = useState(0);
  const [mnemonic, setMnemonic] = useState<null | string>(null);
  const [account, setAccount] = useState<null | AccountProfile>(null);

  return (
    <SubPageLayout>
      {step === 0 ? (
        <TrustBackendPart
          onNext={() => {
            setStep(1);
          }}
        />
      ) : null}
      {step === 1 ? (
        <PassphraseGeneratePart
          onNext={(n) => {
            setMnemonic(n);
            setStep(2);
          }}
        />
      ) : null}
      {step === 2 ? (
        <AccountCreatePart
          onNext={(v) => {
            setAccount(v);
            setStep(3);
          }}
        />
      ) : null}
      {step === 3 ? (
        <VerifyPassphrase
          mnemonic={mnemonic}
          userData={account}
          onNext={() => {
            setStep(4);
          }}
        />
      ) : null}
      {step === 4 ? <p>Success, account now exists</p> : null}
    </SubPageLayout>
  );
}
