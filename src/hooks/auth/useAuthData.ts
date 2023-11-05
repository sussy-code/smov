import { useCallback } from "react";

import { LoginResponse } from "@/backend/accounts/auth";
import {
  BookmarkResponse,
  ProgressResponse,
  UserResponse,
  bookmarkResponsesToEntries,
  progressResponsesToEntries,
} from "@/backend/accounts/user";
import { useAuthStore } from "@/stores/auth";
import { useBookmarkStore } from "@/stores/bookmarks";
import { useProgressStore } from "@/stores/progress";

export function useAuthData() {
  const loggedIn = !!useAuthStore((s) => s.account);
  const setAccount = useAuthStore((s) => s.setAccount);
  const removeAccount = useAuthStore((s) => s.removeAccount);
  const clearBookmarks = useBookmarkStore((s) => s.clear);
  const clearProgress = useProgressStore((s) => s.clear);

  const replaceBookmarks = useBookmarkStore((s) => s.replaceBookmarks);
  const replaceItems = useProgressStore((s) => s.replaceItems);

  const login = useCallback(
    async (account: LoginResponse, user: UserResponse) => {
      setAccount({
        token: account.token,
        userId: user.id,
        sessionId: account.session.id,
        profile: user.profile,
      });
    },
    [setAccount]
  );

  const logout = useCallback(async () => {
    removeAccount();
    clearBookmarks();
    clearProgress();
    // TODO clear settings
  }, [removeAccount, clearBookmarks, clearProgress]);

  const syncData = useCallback(
    async (
      _user: UserResponse,
      progress: ProgressResponse[],
      bookmarks: BookmarkResponse[]
    ) => {
      // TODO sync user settings
      replaceBookmarks(bookmarkResponsesToEntries(bookmarks));
      replaceItems(progressResponsesToEntries(progress));
    },
    [replaceBookmarks, replaceItems]
  );

  return {
    loggedIn,
    login,
    logout,
    syncData,
  };
}
