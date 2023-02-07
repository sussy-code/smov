import { useMisc } from "@/video/state/logic/misc";
import { useMemo } from "react";

export function useInitialized(descriptor: string): { initialized: boolean } {
  const misc = useMisc(descriptor);
  const initialized = useMemo(() => !!misc.initalized, [misc]);
  return {
    initialized,
  };
}
