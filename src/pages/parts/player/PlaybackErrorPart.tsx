import { useRef, useState } from "react";

import { Button } from "@/components/Button";
import { Icon, Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Paragraph } from "@/components/text/Paragraph";
import { Title } from "@/components/text/Title";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";
import { usePlayerStore } from "@/stores/player/store";

export function PlaybackErrorPart() {
  const playbackError = usePlayerStore((s) => s.interface.error);
  const [showErrorCard, setShowErrorCard] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);
  const hasCopiedUnsetDebounce = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  function copyError() {
    if (!playbackError || !navigator.clipboard) return;
    navigator.clipboard.writeText(playbackError.message);

    setHasCopied(true);

    // Debounce unsetting the "has copied" label
    if (hasCopiedUnsetDebounce.current)
      clearTimeout(hasCopiedUnsetDebounce.current);
    hasCopiedUnsetDebounce.current = setTimeout(() => setHasCopied(false), 2e3);
    console.log(hasCopiedUnsetDebounce);
  }

  return (
    <ErrorLayout>
      <ErrorContainer>
        <IconPill icon={Icons.WAND}>Not found</IconPill>
        <Title>Goo goo gaa gaa</Title>
        <Paragraph>
          Oh, my apowogies, sweetie! The itty-bitty movie-web did its utmost
          bestest, but alas, no wucky videos to be spotted anywhere (´⊙ω⊙`)
          Please don&apos;t be angwy, wittle movie-web ish twying so hard. Can
          you find it in your heart to forgive? UwU 💖
        </Paragraph>
        <Button
          href="/"
          theme="purple"
          padding="md:px-12 p-2.5"
          className="mt-6"
        >
          Go home
        </Button>
      </ErrorContainer>
      <ErrorContainer maxWidth="max-w-[45rem]">
        {/* Error */}
        {playbackError && showErrorCard ? (
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
            <div className="mt-4 h-60 overflow-y-auto text-left whitespace-pre pointer-events-auto">
              {playbackError.message}
            </div>
          </div>
        ) : null}
      </ErrorContainer>
    </ErrorLayout>
  );
}
