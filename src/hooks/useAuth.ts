import { useCallback } from "react";

import { accountLogin, getUser, removeSession } from "@/backend/accounts/auth";
import { conf } from "@/setup/config";
import { useAuthStore } from "@/stores/auth";

export function useBackendUrl() {
  const backendUrl = useAuthStore((s) => s.backendUrl);
  return backendUrl ?? conf().BACKEND_URL;
}

export function useAuth() {
  const currentAccount = useAuthStore((s) => s.account);
  const profile = useAuthStore((s) => s.account?.profile);
  const loggedIn = !!useAuthStore((s) => s.account);
  const setAccount = useAuthStore((s) => s.setAccount);
  const removeAccount = useAuthStore((s) => s.removeAccount);
  const backendUrl = useBackendUrl();

  const login = useCallback(
    async (id: string, device: string) => {
      const account = await accountLogin(backendUrl, id, device);
      const user = await getUser(backendUrl, account.token);
      setAccount({
        token: account.token,
        userId: user.id,
        sessionId: account.session.id,
        profile: user.profile,
      });
    },
    [setAccount, backendUrl]
  );

  const logout = useCallback(async () => {
    if (!currentAccount) return;
    try {
      await removeSession(
        backendUrl,
        currentAccount.token,
        currentAccount.sessionId
      );
    } catch {
      // we dont care about failing to delete session
    }
    removeAccount(); // TODO clear local data
  }, [removeAccount, backendUrl, currentAccount]);

  return {
    loggedIn,
    profile,
    login,
    logout,
  };
}
