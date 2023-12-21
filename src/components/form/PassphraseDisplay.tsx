import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCopyToClipboard, useMountedState } from "react-use";

import { Icon, Icons } from "../Icon";

export function PassphraseDisplay(props: { mnemonic: string }) {
  const { t } = useTranslation();
  const individualWords = props.mnemonic.split(" ");

  const [, copy] = useCopyToClipboard();

  const [hasCopied, setHasCopied] = useState(false);
  const isMounted = useMountedState();

  const timeout = useRef<ReturnType<typeof setTimeout>>();

  function copyMnemonic() {
    copy(props.mnemonic);
    setHasCopied(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => isMounted() && setHasCopied(false), 500);
  }

  return (
    <div className="rounded-lg border border-authentication-border/50 ">
      <div className="px-4 py-2 flex justify-between border-b border-authentication-border/50">
        <p className="font-bold text-sm text-white">
          {t("auth.generate.passphraseFrameLabel")}
        </p>
        <button
          type="button"
          className="text-authentication-copyText hover:text-authentication-copyTextHover transition-colors flex gap-2 items-center cursor-pointer"
          onClick={() => copyMnemonic()}
        >
          <Icon
            icon={hasCopied ? Icons.CHECKMARK : Icons.COPY}
            className={hasCopied ? "text-xs" : ""}
          />
          <span className="text-sm">{t("actions.copy")}</span>
        </button>
      </div>
      <div className="px-4 py-4 grid grid-cols-3 text-sm sm:text-base sm:grid-cols-4 gap-2">
        {individualWords.map((word, i) => (
          <div
            className="rounded-md py-2 bg-authentication-wordBackground text-white font-medium text-center"
            // this doesn't get rerendered nor does it have state so its fine
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}
