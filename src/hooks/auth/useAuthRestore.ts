import { useRef } from "react";
import { useAsync, useInterval } from "react-use";

import { useAuth } from "@/hooks/auth/useAuth";

const AUTH_CHECK_INTERVAL = 12 * 60 * 60 * 1000;

export function useAuthRestore() {
  const { restore } = useAuth();
  const hasRestored = useRef(false);

  useInterval(() => {
    restore();
  }, AUTH_CHECK_INTERVAL);

  const result = useAsync(async () => {
    if (hasRestored.current) return;
    await restore().finally(() => {
      hasRestored.current = true;
    });
  }, []); // no deps because we don't want to it ever rerun after the first time

  return result;
}
