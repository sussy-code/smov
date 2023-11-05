import { useMemo } from "react";

import { genMnemonic } from "@/backend/accounts/crypto";
import { Button } from "@/components/Button";

interface PassphraseGeneratePartProps {
  onNext?: (mnemonic: string) => void;
}

export function PassphraseGeneratePart(props: PassphraseGeneratePartProps) {
  const mnemonic = useMemo(() => genMnemonic(), []);

  return (
    <div>
      <p>Remeber the following passphrase:</p>
      <p className="border rounded-xl p-2">{mnemonic}</p>
      <Button onClick={() => props.onNext?.(mnemonic)}>Next</Button>
    </div>
  );
}
