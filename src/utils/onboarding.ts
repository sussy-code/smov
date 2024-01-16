import { isExtensionActive } from "@/backend/extension/messaging";
import { conf } from "@/setup/config";
import { useAuthStore } from "@/stores/auth";
import { useOnboardingStore } from "@/stores/onboarding";

export async function needsOnboarding(): Promise<boolean> {
  // if onboarding is dislabed, no onboarding needed
  if (!conf().HAS_ONBOARDING) return false;

  // if extension is active and working, no onboarding needed
  const extensionActive = await isExtensionActive();
  if (extensionActive) return false;

  // if there is any custom proxy urls, no onboarding needed
  const proxyUrls = useAuthStore.getState().proxySet;
  if (proxyUrls) return false;

  // if onboarding has been completed, no onboarding needed
  const completed = useOnboardingStore.getState().completed;
  if (completed) return false;

  return true;
}
