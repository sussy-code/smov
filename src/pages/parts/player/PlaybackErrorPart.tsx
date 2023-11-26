import { Button } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Paragraph } from "@/components/text/Paragraph";
import { Title } from "@/components/text/Title";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";
import { usePlayerStore } from "@/stores/player/store";

import { ErrorCard } from "../errors/ErrorCard";

export function PlaybackErrorPart() {
  const playbackError = usePlayerStore((s) => s.interface.error);

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
        {playbackError ? <ErrorCard error={playbackError} /> : null}
      </ErrorContainer>
    </ErrorLayout>
  );
}
