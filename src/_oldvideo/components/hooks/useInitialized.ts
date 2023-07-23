import { useMemo } from "react";

import { useMisc } from "@/_oldvideo/state/logic/misc";

export function useInitialized(descriptor: string): { initialized: boolean } {
  const misc = useMisc(descriptor);
  const initialized = useMemo(() => !!misc.initalized, [misc]);
  return {
    initialized,
  };
}
