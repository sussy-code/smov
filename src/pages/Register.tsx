import { useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { SubPageLayout } from "@/pages/layouts/SubPageLayout";
import {
  AccountCreatePart,
  AccountProfile,
} from "@/pages/parts/auth/AccountCreatePart";
import { PassphraseGeneratePart } from "@/pages/parts/auth/PassphraseGeneratePart";
import { TrustBackendPart } from "@/pages/parts/auth/TrustBackendPart";
import { VerifyPassphrase } from "@/pages/parts/auth/VerifyPassphrasePart";
import { conf } from "@/setup/config";

export function RegisterPage() {
  const [step, setStep] = useState(0);
  const [mnemonic, setMnemonic] = useState<null | string>(null);
  const [account, setAccount] = useState<null | AccountProfile>(null);
  const reCaptchaKey = conf().RECAPTCHA_SITE_KEY;

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
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
            onNext={(m) => {
              setMnemonic(m);
              setStep(2);
            }}
          />
        ) : null}
        {step === 2 ? (
          <AccountCreatePart
            onNext={(a) => {
              setAccount(a);
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
    </GoogleReCaptchaProvider>
  );
}
