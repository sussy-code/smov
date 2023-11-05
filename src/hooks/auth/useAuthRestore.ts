import { useAsync, useInterval } from "react-use";

import { useAuth } from "@/hooks/auth/useAuth";

const AUTH_CHECK_INTERVAL = 12 * 60 * 60 * 1000;

export function useAuthRestore() {
  const { restore } = useAuth();

  useInterval(() => {
    restore();
  }, AUTH_CHECK_INTERVAL);

  const result = useAsync(() => restore(), [restore]);
  return result;
}
