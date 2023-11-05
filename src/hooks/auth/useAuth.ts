import { useCallback } from "react";

import { removeSession } from "@/backend/accounts/auth";
import {
  bytesToBase64Url,
  keysFromMnemonic,
  signChallenge,
} from "@/backend/accounts/crypto";
import { getLoginChallengeToken, loginAccount } from "@/backend/accounts/login";
import {
  getRegisterChallengeToken,
  registerAccount,
} from "@/backend/accounts/register";
import { getBookmarks, getProgress, getUser } from "@/backend/accounts/user";
import { useAuthData } from "@/hooks/auth/useAuthData";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { useAuthStore } from "@/stores/auth";

export interface RegistrationData {
  mnemonic: string;
  userData: {
    device: string;
    profile: {
      colorA: string;
      colorB: string;
      icon: string;
    };
  };
}

export interface LoginData {
  mnemonic: string;
  userData: {
    device: string;
  };
}

export function useAuth() {
  const currentAccount = useAuthStore((s) => s.account);
  const profile = useAuthStore((s) => s.account?.profile);
  const loggedIn = !!useAuthStore((s) => s.account);
  const backendUrl = useBackendUrl();
  const {
    logout: userDataLogout,
    login: userDataLogin,
    syncData,
  } = useAuthData();

  const login = useCallback(
    async (loginData: LoginData) => {
      const keys = await keysFromMnemonic(loginData.mnemonic);
      const { challenge } = await getLoginChallengeToken(
        backendUrl,
        bytesToBase64Url(keys.publicKey)
      );
      const signResult = await signChallenge(loginData.mnemonic, challenge);
      const loginResult = await loginAccount(backendUrl, {
        challenge: {
          code: challenge,
          signature: signResult.signature,
        },
        publicKey: signResult.publicKey,
        device: loginData.userData.device,
      });

      const user = await getUser(backendUrl, loginResult.token);
      await userDataLogin(loginResult, user);
    },
    [userDataLogin, backendUrl]
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
    userDataLogout();
  }, [userDataLogout, backendUrl, currentAccount]);

  const register = useCallback(
    async (registerData: RegistrationData) => {
      const { challenge } = await getRegisterChallengeToken(backendUrl);
      const signResult = await signChallenge(registerData.mnemonic, challenge);
      const registerResult = await registerAccount(backendUrl, {
        challenge: {
          code: challenge,
          signature: signResult.signature,
        },
        publicKey: signResult.publicKey,
        device: registerData.userData.device,
        profile: registerData.userData.profile,
      });

      await userDataLogin(registerResult, registerResult.user);
    },
    [backendUrl, userDataLogin]
  );

  const restore = useCallback(async () => {
    if (!currentAccount) {
      return;
    }

    // TODO if fail to get user, log them out
    const user = await getUser(backendUrl, currentAccount.token);
    const bookmarks = await getBookmarks(backendUrl, currentAccount);
    const progress = await getProgress(backendUrl, currentAccount);

    syncData(user, progress, bookmarks);
  }, [backendUrl, currentAccount, syncData]);

  return {
    loggedIn,
    profile,
    login,
    logout,
    register,
    restore,
  };
}
