import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Icon, Icons } from "@/components/Icon";
import { Modal } from "@/components/overlays/Modal";
import { DisplayError } from "@/components/player/display/displayInterface";

export function ErrorCard(props: {
  error: DisplayError | string;
  onClose: () => void;
}) {
  const [hasCopied, setHasCopied] = useState(false);
  const hasCopiedUnsetDebounce = useRef<ReturnType<typeof setTimeout> | null>(
    null,
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

  return (
    // I didn't put a <Transition> here because it'd fade out, then jump height weirdly
    <div className="bg-errors-card w-full rounded-lg p-6 text-left">
      <div className="border-errors-border flex items-center justify-between border-b pb-2">
        <span className="font-medium text-white">{t("errors.details")}</span>
        <div className="flex items-center justify-center gap-3">
          <Button
            theme="secondary"
            padding="p-2 h-10 min-w-[40px] md:px-4"
            onClick={() => copyError()}
          >
            {hasCopied ? (
              <>
                <Icon icon={Icons.CHECKMARK} className="text-xs" />
                <span className="hidden min-[400px]:inline-block ml-3">
                  {t("actions.copied")}
                </span>
              </>
            ) : (
              <>
                <Icon icon={Icons.COPY} className="text-2xl" />
                <span className="hidden min-[400px]:inline-block ml-3">
                  {t("actions.copy")}
                </span>
              </>
            )}
          </Button>
          <Button
            theme="secondary"
            padding="p-2 md:px-2"
            onClick={props.onClose}
          >
            <Icon icon={Icons.X} className="text-2xl" />
          </Button>
        </div>
      </div>
      <div className="pointer-events-auto mt-4 h-60 select-text overflow-y-auto whitespace-pre text-left">
        {errorMessage}
      </div>
    </div>
  );
}

// use plain modal version if there is no access to history api (like in error boundary)
export function ErrorCardInPlainModal(props: {
  error?: DisplayError | string;
  onClose: () => void;
  show?: boolean;
}) {
  if (!props.show || !props.error) return null;
  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-30 p-12">
      <div className="w-full max-w-2xl">
        <ErrorCard error={props.error} onClose={props.onClose} />
      </div>
    </div>
  );
}

export function ErrorCardInModal(props: {
  error?: DisplayError | string;
  id: string;
  onClose: () => void;
}) {
  if (!props.error) return null;

  return (
    <Modal id={props.id}>
      <div className="pointer-events-auto w-11/12 max-w-2xl">
        <ErrorCard error={props.error} onClose={props.onClose} />
      </div>
    </Modal>
  );
}
