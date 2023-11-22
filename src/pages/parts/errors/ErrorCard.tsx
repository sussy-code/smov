import { useRef, useState } from "react";

import { Button } from "@/components/Button";
import { Icon, Icons } from "@/components/Icon";
import { DisplayError } from "@/components/player/display/displayInterface";

export function ErrorCard(props: { error: DisplayError | string }) {
  const [showErrorCard, setShowErrorCard] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);
  const hasCopiedUnsetDebounce = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const errorMessage =
    typeof props.error === "string" ? props.error : props.error.message;

  function copyError() {
    if (!props.error || !navigator.clipboard) return;
    navigator.clipboard.writeText(errorMessage);

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
        <span className="text-white font-medium">Error details</span>
        <div className="flex justify-center items-center gap-3">
          <Button
            theme="secondary"
            padding="p-2 md:px-4"
            onClick={() => copyError()}
          >
            {hasCopied ? (
              <>
                <Icon icon={Icons.CHECKMARK} className="text-xs mr-3" />
                Copied
              </>
            ) : (
              <>
                <Icon icon={Icons.COPY} className="text-2xl mr-3" />
                Copy
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
