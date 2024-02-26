import { useCallback } from "react";

import { LoginResponse, SessionResponse } from "@/backend/accounts/auth";
import { SettingsResponse } from "@/backend/accounts/settings";
import {
  BookmarkResponse,
  ProgressResponse,
  UserResponse,
  bookmarkResponsesToEntries,
  progressResponsesToEntries,
} from "@/backend/accounts/user";
import { useAuthStore } from "@/stores/auth";
import { useBookmarkStore } from "@/stores/bookmarks";
import { useLanguageStore } from "@/stores/language";
import { useProgressStore } from "@/stores/progress";
import { useSubtitleStore } from "@/stores/subtitles";
import { useThemeStore } from "@/stores/theme";

export function useAuthData() {
  const loggedIn = !!useAuthStore((s) => s.account);
  const setAccount = useAuthStore((s) => s.setAccount);
  const removeAccount = useAuthStore((s) => s.removeAccount);
  const setProxySet = useAuthStore((s) => s.setProxySet);
  const clearBookmarks = useBookmarkStore((s) => s.clear);
  const clearProgress = useProgressStore((s) => s.clear);
  const setTheme = useThemeStore((s) => s.setTheme);
  const setAppLanguage = useLanguageStore((s) => s.setLanguage);
  const importSubtitleLanguage = useSubtitleStore(
    (s) => s.importSubtitleLanguage,
  );

  const replaceBookmarks = useBookmarkStore((s) => s.replaceBookmarks);
  const replaceItems = useProgressStore((s) => s.replaceItems);

  const login = useCallback(
    async (
      loginResponse: LoginResponse,
      user: UserResponse,
      session: SessionResponse,
      seed: string,
    ) => {
      const account = {
        token: loginResponse.token,
        userId: user.id,
        sessionId: loginResponse.session.id,
        deviceName: session.device,
        profile: user.profile,
        seed,
      };
      setAccount(account);
      return account;
    },
    [setAccount],
  );

  const logout = useCallback(async () => {
    removeAccount();
    clearBookmarks();
    clearProgress();
  }, [removeAccount, clearBookmarks, clearProgress]);

  const syncData = useCallback(
    async (
      _user: UserResponse,
      _session: SessionResponse,
      progress: ProgressResponse[],
      bookmarks: BookmarkResponse[],
      settings: SettingsResponse,
    ) => {
      replaceBookmarks(bookmarkResponsesToEntries(bookmarks));
      replaceItems(progressResponsesToEntries(progress));

      if (settings.applicationLanguage) {
        setAppLanguage(settings.applicationLanguage);
      }

      if (settings.defaultSubtitleLanguage) {
        importSubtitleLanguage(settings.defaultSubtitleLanguage);
      }

      if (settings.applicationTheme) {
        setTheme(settings.applicationTheme);
      }

      if (settings.proxyUrls) {
        setProxySet(settings.proxyUrls);
      }
    },
    [
      replaceBookmarks,
      replaceItems,
      setAppLanguage,
      importSubtitleLanguage,
      setTheme,
      setProxySet,
    ],
  );

  return {
    loggedIn,
    login,
    logout,
    syncData,
  };
}
