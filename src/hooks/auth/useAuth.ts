import { useCallback } from "react";

import { SessionResponse } from "@/backend/accounts/auth";
import { bookmarkMediaToInput } from "@/backend/accounts/bookmarks";
import {
  bytesToBase64,
  bytesToBase64Url,
  encryptData,
  keysFromMnemonic,
  signChallenge,
} from "@/backend/accounts/crypto";
import { importBookmarks, importProgress } from "@/backend/accounts/import";
import { getLoginChallengeToken, loginAccount } from "@/backend/accounts/login";
import { progressMediaItemToInputs } from "@/backend/accounts/progress";
import {
  getRegisterChallengeToken,
  registerAccount,
} from "@/backend/accounts/register";
import { removeSession } from "@/backend/accounts/sessions";
import { getSettings } from "@/backend/accounts/settings";
import {
  UserResponse,
  getBookmarks,
  getProgress,
  getUser,
} from "@/backend/accounts/user";
import { useAuthData } from "@/hooks/auth/useAuthData";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { AccountWithToken, useAuthStore } from "@/stores/auth";
import { BookmarkMediaItem } from "@/stores/bookmarks";
import { ProgressMediaItem } from "@/stores/progress";

export interface RegistrationData {
  recaptchaToken?: string;
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
      if (!backendUrl) return;
      const keys = await keysFromMnemonic(loginData.mnemonic);
      const publicKeyBase64Url = bytesToBase64Url(keys.publicKey);
      const { challenge } = await getLoginChallengeToken(
        backendUrl,
        publicKeyBase64Url,
      );
      const signature = await signChallenge(keys, challenge);
      const loginResult = await loginAccount(backendUrl, {
        challenge: {
          code: challenge,
          signature,
        },
        publicKey: publicKeyBase64Url,
        device: await encryptData(loginData.userData.device, keys.seed),
      });

      const user = await getUser(backendUrl, loginResult.token);
      const seedBase64 = bytesToBase64(keys.seed);
      return userDataLogin(loginResult, user.user, user.session, seedBase64);
    },
    [userDataLogin, backendUrl],
  );

  const logout = useCallback(async () => {
    if (!currentAccount || !backendUrl) return;
    try {
      await removeSession(
        backendUrl,
        currentAccount.token,
        currentAccount.sessionId,
      );
    } catch {
      // we dont care about failing to delete session
    }
    await userDataLogout();
  }, [userDataLogout, backendUrl, currentAccount]);

  const register = useCallback(
    async (registerData: RegistrationData) => {
      if (!backendUrl) return;
      const { challenge } = await getRegisterChallengeToken(
        backendUrl,
        registerData.recaptchaToken,
      );
      const keys = await keysFromMnemonic(registerData.mnemonic);
      const signature = await signChallenge(keys, challenge);
      const registerResult = await registerAccount(backendUrl, {
        challenge: {
          code: challenge,
          signature,
        },
        publicKey: bytesToBase64Url(keys.publicKey),
        device: await encryptData(registerData.userData.device, keys.seed),
        profile: registerData.userData.profile,
      });

      return userDataLogin(
        registerResult,
        registerResult.user,
        registerResult.session,
        bytesToBase64(keys.seed),
      );
    },
    [backendUrl, userDataLogin],
  );

  const importData = useCallback(
    async (
      account: AccountWithToken,
      progressItems: Record<string, ProgressMediaItem>,
      bookmarks: Record<string, BookmarkMediaItem>,
    ) => {
      if (!backendUrl) return;
      if (
        Object.keys(progressItems).length === 0 &&
        Object.keys(bookmarks).length === 0
      ) {
        return;
      }

      const progressInputs = Object.entries(progressItems).flatMap(
        ([tmdbId, item]) => progressMediaItemToInputs(tmdbId, item),
      );

      const bookmarkInputs = Object.entries(bookmarks).map(([tmdbId, item]) =>
        bookmarkMediaToInput(tmdbId, item),
      );

      await Promise.all([
        importProgress(backendUrl, account, progressInputs),
        importBookmarks(backendUrl, account, bookmarkInputs),
      ]);
    },
    [backendUrl],
  );

  const restore = useCallback(
    async (account: AccountWithToken) => {
      if (!backendUrl) return;
      let user: { user: UserResponse; session: SessionResponse };
      try {
        user = await getUser(backendUrl, account.token);
      } catch (err) {
        const anyError: any = err;
        if (
          anyError?.response?.status === 401 ||
          anyError?.response?.status === 403 ||
          anyError?.response?.status === 400
        ) {
          await logout();
          return;
        }
        console.error(err);
        throw err;
      }

      const [bookmarks, progress, settings] = await Promise.all([
        getBookmarks(backendUrl, account),
        getProgress(backendUrl, account),
        getSettings(backendUrl, account),
      ]);

      syncData(user.user, user.session, progress, bookmarks, settings);
    },
    [backendUrl, syncData, logout],
  );

  return {
    loggedIn,
    profile,
    login,
    logout,
    register,
    restore,
    importData,
  };
}
