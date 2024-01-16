import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useQueryParam } from "@/hooks/useQueryParams";
import { useOnboardingStore } from "@/stores/onboarding";

export function useRedirectBack() {
  const [url] = useQueryParam("redirect");
  const navigate = useNavigate();
  const setCompleted = useOnboardingStore((s) => s.setCompleted);

  const redirectBack = useCallback(() => {
    navigate(url ?? "/");
  }, [navigate, url]);

  const completeAndRedirect = useCallback(() => {
    setCompleted(true);
    redirectBack();
  }, [redirectBack, setCompleted]);

  return { completeAndRedirect };
}
