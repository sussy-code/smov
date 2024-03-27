import { isAllowedExtensionVersion } from "@/backend/extension/compatibility";
import {
  extensionInfo,
  isExtensionActive,
} from "@/backend/extension/messaging";
import { conf } from "@/setup/config";
import { useAuthStore } from "@/stores/auth";
import { useOnboardingStore } from "@/stores/onboarding";

export type ExtensionStatus =
  | "unknown"
  | "failed"
  | "disallowed"
  | "noperms"
  | "outdated"
  | "success";

export async function getExtensionState(): Promise<ExtensionStatus> {
  const info = await extensionInfo();
  if (!info) return "unknown"; // cant talk to extension
  if (!info.success) return "failed"; // extension failed to respond
  if (!info.allowed) return "disallowed"; // extension is not enabled on this page
  if (!info.hasPermission) return "noperms"; // extension has no perms to do it's tasks
  if (!isAllowedExtensionVersion(info.version)) return "outdated"; // extension is too old
  return "success"; // no problems
}

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
