import { conf } from "@/setup/config";
import { useAuthStore } from "@/stores/auth";

export function useBackendUrl(): string | undefined {
  const backendUrl = useAuthStore((s) => s.backendUrl);
  return backendUrl ?? conf().BACKEND_URL;
}
