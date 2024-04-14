import { isExtensionActiveCached } from "@/backend/extension/messaging";
import { conf } from "@/setup/config";
import { useAuthStore } from "@/stores/auth";

export function isAutoplayAllowed() {
  return Boolean(
    conf().ALLOW_AUTOPLAY ||
      isExtensionActiveCached() ||
      useAuthStore.getState().proxySet,
  );
}
