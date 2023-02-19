import { useCallback } from "react";
import { useHistory } from "react-router-dom";

export function useGoBack() {
  const reactHistory = useHistory();

  const goBack = useCallback(() => {
    if (reactHistory.action !== "POP") reactHistory.goBack();
    else reactHistory.push("/");
  }, [reactHistory]);
  return goBack;
}
