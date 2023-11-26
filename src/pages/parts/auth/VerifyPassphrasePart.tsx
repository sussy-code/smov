import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useAsyncFn } from "react-use";

import { updateSettings } from "@/backend/accounts/settings";
import { Button } from "@/components/buttons/Button";
import { Icon, Icons } from "@/components/Icon";
import {
  LargeCard,
  LargeCardButtons,
  LargeCardText,
} from "@/components/layout/LargeCard";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";
import { useAuth } from "@/hooks/auth/useAuth";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { AccountProfile } from "@/pages/parts/auth/AccountCreatePart";
import { useBookmarkStore } from "@/stores/bookmarks";
import { useLanguageStore } from "@/stores/language";
import { useProgressStore } from "@/stores/progress";
import { useSubtitleStore } from "@/stores/subtitles";
import { useThemeStore } from "@/stores/theme";

interface VerifyPassphraseProps {
  mnemonic: string | null;
  hasCaptcha?: boolean;
  userData: AccountProfile | null;
  onNext?: () => void;
}

export function VerifyPassphrase(props: VerifyPassphraseProps) {
  const [mnemonic, setMnemonic] = useState("");
  const { register, restore, importData } = useAuth();
  const progressItems = useProgressStore((store) => store.items);
  const bookmarkItems = useBookmarkStore((store) => store.bookmarks);

  const applicationLanguage = useLanguageStore((store) => store.language);
  const defaultSubtitleLanguage = useSubtitleStore(
    (store) => store.lastSelectedLanguage
  );
  const applicationTheme = useThemeStore((store) => store.theme);

  const backendUrl = useBackendUrl();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [result, execute] = useAsyncFn(
    async (inputMnemonic: string) => {
      if (!props.mnemonic || !props.userData)
        throw new Error("Data is not valid");

      let recaptchaToken: string | undefined;
      if (props.hasCaptcha) {
        recaptchaToken = executeRecaptcha
          ? await executeRecaptcha()
          : undefined;
        if (!recaptchaToken) throw new Error("ReCaptcha validation failed");
      }

      if (inputMnemonic !== props.mnemonic)
        throw new Error("Passphrase doesn't match");

      const account = await register({
        mnemonic: inputMnemonic,
        userData: props.userData,
        recaptchaToken,
      });

      await importData(account, progressItems, bookmarkItems);

      await updateSettings(backendUrl, account, {
        applicationLanguage,
        defaultSubtitleLanguage: defaultSubtitleLanguage ?? undefined,
        applicationTheme: applicationTheme ?? undefined,
      });

      await restore(account);

      props.onNext?.();
    },
    [props, register, restore]
  );

  return (
    <LargeCard>
      <form>
        <LargeCardText
          icon={<Icon icon={Icons.CIRCLE_CHECK} />}
          title="Enter your passphrase"
        >
          If you&apos;ve already lost it, how will you ever be able to take care
          of a child?
        </LargeCardText>
        <AuthInputBox
          label="Your passphrase"
          autoComplete="username"
          name="username"
          value={mnemonic}
          onChange={setMnemonic}
        />
        {result.error ? (
          <p className="mt-3 text-authentication-errorText">
            {result.error.message}
          </p>
        ) : null}
        <LargeCardButtons>
          <Button
            theme="purple"
            loading={result.loading}
            onClick={() => execute(mnemonic)}
          >
            Register
          </Button>
        </LargeCardButtons>
      </form>
    </LargeCard>
  );
}
