import { useMemo } from "react";

import { genMnemonic } from "@/backend/accounts/crypto";
import { Button } from "@/components/Button";
import { Icon, Icons } from "@/components/Icon";
import {
  LargeCard,
  LargeCardButtons,
  LargeCardText,
} from "@/components/layout/LargeCard";
import { PassphraseDisplay } from "@/components/PassphraseDisplay";

interface PassphraseGeneratePartProps {
  onNext?: (mnemonic: string) => void;
}

export function PassphraseGeneratePart(props: PassphraseGeneratePartProps) {
  const mnemonic = useMemo(() => genMnemonic(), []);

  return (
    <LargeCard>
      <LargeCardText title="Your passphrase" icon={<Icon icon={Icons.USER} />}>
        If you lose this, you&apos;re a silly goose and will be posted on the
        wall of shame™️
      </LargeCardText>
      <PassphraseDisplay mnemonic={mnemonic} />

      <LargeCardButtons>
        <Button theme="purple" onClick={() => props.onNext?.(mnemonic)}>
          NEXT!
        </Button>
      </LargeCardButtons>
    </LargeCard>
  );
}
