import { useCallback } from "react";

import { SessionResponse } from "@/backend/accounts/auth";
import { bookmarkMediaToInput } from "@/backend/accounts/bookmarks";
import {
  base64ToBuffer,
  bytesToBase64,
  bytesToBase64Url,
  encryptData,
  keysFromMnemonic,
  keysFromSeed,
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
import { BookmarkMediaItem, useBookmarkStore } from "@/stores/bookmarks";
import { ProgressMediaItem, useProgressStore } from "@/stores/progress";

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

export function useMigration() {
  const currentAccount = useAuthStore((s) => s.account);
  const progress = useProgressStore((s) => s.items);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const { login: userDataLogin } = useAuthData();

  const importData = async (
    backendUrl: string,
    account: AccountWithToken,
    progressItems: Record<string, ProgressMediaItem>,
    bookmarkItems: Record<string, BookmarkMediaItem>,
  ) => {
    if (
      Object.keys(progressItems).length === 0 &&
      Object.keys(bookmarkItems).length === 0
    ) {
      return;
    }

    const progressInputs = Object.entries(progressItems).flatMap(
      ([tmdbId, item]) => progressMediaItemToInputs(tmdbId, item),
    );

    const bookmarkInputs = Object.entries(bookmarkItems).map(([tmdbId, item]) =>
      bookmarkMediaToInput(tmdbId, item),
    );

    await Promise.all([
      importProgress(backendUrl, account, progressInputs),
      importBookmarks(backendUrl, account, bookmarkInputs),
    ]);
  };

  const migrate = useCallback(
    async (backendUrl: string, recaptchaToken?: string) => {
      if (!currentAccount) return;

      const { challenge } = await getRegisterChallengeToken(
        backendUrl,
        recaptchaToken || undefined, // Pass undefined if token is not provided
      );
      const keys = await keysFromSeed(base64ToBuffer(currentAccount.seed));
      const signature = await signChallenge(keys, challenge);
      const registerResult = await registerAccount(backendUrl, {
        challenge: {
          code: challenge,
          signature,
        },
        publicKey: bytesToBase64Url(keys.publicKey),
        device: await encryptData(currentAccount.deviceName, keys.seed),
        profile: currentAccount.profile,
      });

      const account = await userDataLogin(
        registerResult,
        registerResult.user,
        registerResult.session,
        bytesToBase64(keys.seed),
      );

      await importData(backendUrl, account, progress, bookmarks);

      return account;
    },
    [currentAccount, userDataLogin, bookmarks, progress],
  );

  return {
    migrate,
  };
}
