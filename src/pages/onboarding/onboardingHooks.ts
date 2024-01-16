import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useQueryParam } from "@/hooks/useQueryParams";
import { useOnboardingStore } from "@/stores/onboarding";

export function useRedirectBack() {
  const [url] = useQueryParam("redirect");
  const navigate = useNavigate();
  const setSkipped = useOnboardingStore((s) => s.setSkipped);

  const redirectBack = useCallback(() => {
    navigate(url ?? "/");
  }, [navigate, url]);

  const skipAndRedirect = useCallback(() => {
    setSkipped(true);
    redirectBack();
  }, [redirectBack, setSkipped]);

  return { redirectBack, skipAndRedirect };
}
