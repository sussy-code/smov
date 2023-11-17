import { useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { MetaResponse } from "@/backend/accounts/meta";
import { SubPageLayout } from "@/pages/layouts/SubPageLayout";
import {
  AccountCreatePart,
  AccountProfile,
} from "@/pages/parts/auth/AccountCreatePart";
import { PassphraseGeneratePart } from "@/pages/parts/auth/PassphraseGeneratePart";
import { TrustBackendPart } from "@/pages/parts/auth/TrustBackendPart";
import { VerifyPassphrase } from "@/pages/parts/auth/VerifyPassphrasePart";

function CaptchaProvider(props: {
  siteKey: string | null;
  children: JSX.Element;
}) {
  if (!props.siteKey) return props.children;
  return (
    <GoogleReCaptchaProvider reCaptchaKey={props.siteKey}>
      {props.children}
    </GoogleReCaptchaProvider>
  );
}

export function RegisterPage() {
  const [step, setStep] = useState(0);
  const [mnemonic, setMnemonic] = useState<null | string>(null);
  const [account, setAccount] = useState<null | AccountProfile>(null);
  const [siteKey, setSiteKey] = useState<string | null>(null);

  // TODO because of user data loading (in useAuthRestore()), the register page gets unmounted before finishing the register flow

  return (
    <CaptchaProvider siteKey={siteKey}>
      <SubPageLayout>
        {step === 0 ? (
          <TrustBackendPart
            onNext={(meta: MetaResponse) => {
              setSiteKey(
                meta.hasCaptcha && meta.captchaClientKey
                  ? meta.captchaClientKey
                  : null
              );
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
            hasCaptcha={!!siteKey}
            mnemonic={mnemonic}
            userData={account}
            onNext={() => {
              setStep(4);
            }}
          />
        ) : null}
        {step === 4 ? <p>Success, account now exists</p> : null}
      </SubPageLayout>
    </CaptchaProvider>
  );
}
