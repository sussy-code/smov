import { useCallback } from "react";

import { Menu } from "@/components/player/internals/ContextMenu";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { AudioTrack } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

import { SelectableLink } from "../../internals/ContextMenu/Links";

export function AudioView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const audioTracks = usePlayerStore((s) => s.audioTracks);
  const currentAudioTrack = usePlayerStore((s) => s.currentAudioTrack);
  const changeAudioTrack = usePlayerStore((s) => s.display?.changeAudioTrack);

  const change = useCallback(
    (track: AudioTrack) => {
      changeAudioTrack?.(track);
      router.close();
    },
    [router, changeAudioTrack],
  );

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/")}>Audio</Menu.BackLink>
      <Menu.Section className="flex flex-col pb-4">
        {audioTracks.map((v) => (
          <SelectableLink
            key={v.id}
            selected={v.id === currentAudioTrack?.id}
            onClick={audioTracks.includes(v) ? () => change(v) : undefined}
            disabled={!audioTracks.includes(v)}
          >
            {v.label} ({v.language})
          </SelectableLink>
        ))}
      </Menu.Section>
    </>
  );
}
