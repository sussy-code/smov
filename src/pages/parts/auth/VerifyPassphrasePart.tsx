import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useTranslation } from "react-i18next";
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
    (store) => store.lastSelectedLanguage,
  );
  const applicationTheme = useThemeStore((store) => store.theme);

  const backendUrl = useBackendUrl();
  const { t } = useTranslation();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [result, execute] = useAsyncFn(
    async (inputMnemonic: string) => {
      if (!backendUrl)
        throw new Error(t("auth.verify.noBackendUrl") ?? undefined);
      if (!props.mnemonic || !props.userData)
        throw new Error(t("auth.verify.invalidData") ?? undefined);

      let recaptchaToken: string | undefined;
      if (props.hasCaptcha) {
        recaptchaToken = executeRecaptcha
          ? await executeRecaptcha()
          : undefined;
        if (!recaptchaToken)
          throw new Error(t("auth.verify.recaptchaFailed") ?? undefined);
      }

      if (inputMnemonic !== props.mnemonic)
        throw new Error(t("auth.verify.noMatch") ?? undefined);

      const account = await register({
        mnemonic: inputMnemonic,
        userData: props.userData,
        recaptchaToken,
      });

      if (!account)
        throw new Error(t("auth.verify.registrationFailed") ?? undefined);

      await importData(account, progressItems, bookmarkItems);

      await updateSettings(backendUrl, account, {
        applicationLanguage,
        defaultSubtitleLanguage: defaultSubtitleLanguage ?? undefined,
        applicationTheme: applicationTheme ?? undefined,
        proxyUrls: undefined,
      });

      await restore(account);

      props.onNext?.();
    },
    [props, register, restore],
  );

  return (
    <LargeCard>
      <form>
        <LargeCardText
          icon={<Icon icon={Icons.CIRCLE_CHECK} />}
          title={t("auth.verify.title")}
        >
          {t("auth.verify.description")}
        </LargeCardText>
        <AuthInputBox
          label={t("auth.verify.passphraseLabel") ?? undefined}
          autoComplete="username"
          name="username"
          value={mnemonic}
          onChange={setMnemonic}
          passwordToggleable
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
            {t("auth.verify.register")}
          </Button>
        </LargeCardButtons>
      </form>
    </LargeCard>
  );
}
