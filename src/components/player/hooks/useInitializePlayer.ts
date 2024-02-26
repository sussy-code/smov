import { useCallback, useEffect, useMemo, useRef } from "react";

import { usePlayerStore } from "@/stores/player/store";
import { useVolumeStore } from "@/stores/volume";

import { useCaptions } from "./useCaptions";

export function useInitializePlayer() {
  const display = usePlayerStore((s) => s.display);
  const volume = useVolumeStore((s) => s.volume);

  const init = useCallback(() => {
    display?.setVolume(volume);
  }, [display, volume]);

  return {
    init,
  };
}

export function useInitializeSource() {
  const source = usePlayerStore((s) => s.source);
  const sourceIdentifier = useMemo(
    () => (source ? JSON.stringify(source) : null),
    [source],
  );
  const { selectLastUsedLanguageIfEnabled } = useCaptions();

  const funRef = useRef(selectLastUsedLanguageIfEnabled);
  useEffect(() => {
    funRef.current = selectLastUsedLanguageIfEnabled;
  }, [selectLastUsedLanguageIfEnabled]);

  useEffect(() => {
    if (sourceIdentifier) funRef.current();
  }, [sourceIdentifier]);
}
