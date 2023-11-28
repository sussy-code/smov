import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Icon, Icons } from "@/components/Icon";
import { DisplayError } from "@/components/player/display/displayInterface";

export function ErrorCard(props: { error: DisplayError | string }) {
  const [showErrorCard, setShowErrorCard] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);
  const hasCopiedUnsetDebounce = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const { t } = useTranslation();

  let errorMessage: string | null = null;
  if (typeof props.error === "string") errorMessage = props.error;
  else if (props.error.key)
    errorMessage = `${props.error.type}: ${t(props.error.key)}`;
  else if (props.error.message)
    errorMessage = `${props.error.type}: ${t(props.error.message)}`;

  function copyError() {
    if (!props.error || !navigator.clipboard) return;
    navigator.clipboard.writeText(`\`\`\`${errorMessage}\`\`\``);

    setHasCopied(true);

    // Debounce unsetting the "has copied" label
    if (hasCopiedUnsetDebounce.current)
      clearTimeout(hasCopiedUnsetDebounce.current);
    hasCopiedUnsetDebounce.current = setTimeout(() => setHasCopied(false), 2e3);
  }

  if (!showErrorCard) return null;

  return (
    // I didn't put a <Transition> here because it'd fade out, then jump height weirdly
    <div className="w-full bg-errors-card p-6 rounded-lg">
      <div className="flex justify-between items-center pb-2 border-b border-errors-border">
        <span className="text-white font-medium">{t("errors.details")}</span>
        <div className="flex justify-center items-center gap-3">
          <Button
            theme="secondary"
            padding="p-2 md:px-4"
            onClick={() => copyError()}
          >
            {hasCopied ? (
              <>
                <Icon icon={Icons.CHECKMARK} className="text-xs mr-3" />
                {t("actions.copied")}
              </>
            ) : (
              <>
                <Icon icon={Icons.COPY} className="text-2xl mr-3" />
                {t("actions.copy")}
              </>
            )}
          </Button>
          <Button
            theme="secondary"
            padding="p-2 md:px-2"
            onClick={() => setShowErrorCard(false)}
          >
            <Icon icon={Icons.X} className="text-2xl" />
          </Button>
        </div>
      </div>
      <div className="mt-4 h-60 overflow-y-auto text-left whitespace-pre pointer-events-auto select-text">
        {errorMessage}
      </div>
    </div>
  );
}
