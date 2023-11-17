import { useRef, useState } from "react";
import { useCopyToClipboard } from "react-use";

import { Icon, Icons } from "./Icon";

export function PassphaseDisplay(props: { mnemonic: string }) {
  const individualWords = props.mnemonic.split(" ");

  const [, copy] = useCopyToClipboard();

  const [hasCopied, setHasCopied] = useState(false);

  const timeout = useRef<ReturnType<typeof setTimeout>>();

  function copyMnemonic() {
    copy(props.mnemonic);
    setHasCopied(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setHasCopied(false), 500);
  }

  return (
    <div className="rounded-lg border border-authentication-border/50 ">
      <div className="px-4 py-2 flex justify-between border-b border-authentication-border/50">
        <p className="font-bold text-sm text-white">Passphase</p>
        <button
          type="button"
          className="text-authentication-copyText hover:text-authentication-copyTextHover transition-colors flex gap-2 items-center cursor-pointer"
          onClick={() => copyMnemonic()}
        >
          <Icon
            icon={hasCopied ? Icons.CHECKMARK : Icons.COPY}
            className={hasCopied ? "text-xs" : ""}
          />
          <span className="text-sm">Copy</span>
        </button>
      </div>
      <div className="px-4 py-4 flex flex-wrap gap-x-2 gap-y-4">
        {individualWords.map((word) => (
          <div
            className="px-4 rounded-md py-2 bg-authentication-wordBackground text-white font-medium"
            key={word}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}
