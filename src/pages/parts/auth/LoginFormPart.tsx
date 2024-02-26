import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useAsyncFn } from "react-use";
import type { AsyncReturnType } from "type-fest";

import { verifyValidMnemonic } from "@/backend/accounts/crypto";
import { Button } from "@/components/buttons/Button";
import { BrandPill } from "@/components/layout/BrandPill";
import {
  LargeCard,
  LargeCardButtons,
  LargeCardText,
} from "@/components/layout/LargeCard";
import { MwLink } from "@/components/text/Link";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";
import { useAuth } from "@/hooks/auth/useAuth";
import { useBookmarkStore } from "@/stores/bookmarks";
import { useProgressStore } from "@/stores/progress";

interface LoginFormPartProps {
  onLogin?: () => void;
}

export function LoginFormPart(props: LoginFormPartProps) {
  const [mnemonic, setMnemonic] = useState("");
  const [device, setDevice] = useState("");
  const { login, restore, importData } = useAuth();
  const progressItems = useProgressStore((store) => store.items);
  const bookmarkItems = useBookmarkStore((store) => store.bookmarks);
  const { t } = useTranslation();

  const [result, execute] = useAsyncFn(
    async (inputMnemonic: string, inputdevice: string) => {
      if (!verifyValidMnemonic(inputMnemonic))
        throw new Error(t("auth.login.validationError") ?? undefined);

      const validatedDevice = inputdevice.trim();
      if (validatedDevice.length === 0)
        throw new Error(t("auth.login.deviceLengthError") ?? undefined);

      let account: AsyncReturnType<typeof login>;
      try {
        account = await login({
          mnemonic: inputMnemonic,
          userData: {
            device: validatedDevice,
          },
        });
      } catch (err) {
        if ((err as any).status === 401)
          throw new Error(t("auth.login.validationError") ?? undefined);
        throw err;
      }

      await importData(account, progressItems, bookmarkItems);

      await restore(account);

      props.onLogin?.();
    },
    [props, login, restore, t],
  );

  return (
    <LargeCard top={<BrandPill backgroundClass="bg-[#161527]" />}>
      <LargeCardText title={t("auth.login.title")}>
        {t("auth.login.description")}
      </LargeCardText>
      <div className="space-y-4">
        <AuthInputBox
          label={t("auth.login.passphraseLabel") ?? undefined}
          value={mnemonic}
          autoComplete="username"
          name="username"
          onChange={setMnemonic}
          placeholder={t("auth.login.passphrasePlaceholder") ?? undefined}
          passwordToggleable
        />
        <AuthInputBox
          label={t("auth.deviceNameLabel") ?? undefined}
          value={device}
          onChange={setDevice}
          placeholder={t("auth.deviceNamePlaceholder") ?? undefined}
        />
        {result.error && !result.loading ? (
          <p className="text-authentication-errorText">
            {result.error.message}
          </p>
        ) : null}
      </div>

      <LargeCardButtons>
        <Button
          theme="purple"
          loading={result.loading}
          onClick={() => execute(mnemonic, device)}
        >
          {t("auth.login.submit")}
        </Button>
      </LargeCardButtons>
      <p className="text-center mt-6">
        <Trans i18nKey="auth.createAccount">
          <MwLink to="/register">.</MwLink>
        </Trans>
      </p>
    </LargeCard>
  );
}
