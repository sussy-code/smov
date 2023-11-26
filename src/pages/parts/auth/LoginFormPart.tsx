import { useState } from "react";
import { useAsyncFn } from "react-use";

import { verifyValidMnemonic } from "@/backend/accounts/crypto";
import { Button } from "@/components/buttons/Button";
import { BrandPill } from "@/components/layout/BrandPill";
import {
  LargeCard,
  LargeCardButtons,
  LargeCardText,
} from "@/components/layout/LargeCard";
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

  const [result, execute] = useAsyncFn(
    async (inputMnemonic: string, inputdevice: string) => {
      // TODO verify valid device input
      if (!verifyValidMnemonic(inputMnemonic))
        throw new Error("Invalid or incomplete passphrase");

      const account = await login({
        mnemonic: inputMnemonic,
        userData: {
          device: inputdevice,
        },
      });

      await importData(account, progressItems, bookmarkItems);

      await restore(account);

      props.onLogin?.();
    },
    [props, login, restore]
  );

  return (
    <LargeCard top={<BrandPill backgroundClass="bg-[#161527]" />}>
      <LargeCardText title="Login to your account">
        Oh, you&apos;re asking for the key to my top-secret lair, also known as
        The Fortress of Wordsmithery, accessed only by reciting the sacred
        incantation of the 12-word passphrase!
      </LargeCardText>
      <div className="space-y-4">
        <AuthInputBox
          label="12-Word Passphrase"
          value={mnemonic}
          autoComplete="username"
          name="username"
          onChange={setMnemonic}
          placeholder="Passphrase"
        />
        <AuthInputBox
          label="Device name"
          value={device}
          onChange={setDevice}
          placeholder="Device"
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
          LET ME IN!
        </Button>
      </LargeCardButtons>
    </LargeCard>
  );
}
