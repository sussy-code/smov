import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { genMnemonic } from "@/backend/accounts/crypto";
import { Button } from "@/components/buttons/Button";
import { PassphraseDisplay } from "@/components/form/PassphraseDisplay";
import { Icon, Icons } from "@/components/Icon";
import {
  LargeCard,
  LargeCardButtons,
  LargeCardText,
} from "@/components/layout/LargeCard";

interface PassphraseGeneratePartProps {
  onNext?: (mnemonic: string) => void;
}

export function PassphraseGeneratePart(props: PassphraseGeneratePartProps) {
  const mnemonic = useMemo(() => genMnemonic(), []);
  const { t } = useTranslation();

  return (
    <LargeCard>
      <LargeCardText
        title={t("auth.generate.title")}
        icon={<Icon icon={Icons.USER} />}
      >
        {t("auth.generate.description")}
      </LargeCardText>
      <PassphraseDisplay mnemonic={mnemonic} />

      <LargeCardButtons>
        <Button theme="purple" onClick={() => props.onNext?.(mnemonic)}>
          {t("auth.generate.next")}
        </Button>
      </LargeCardButtons>
    </LargeCard>
  );
}
