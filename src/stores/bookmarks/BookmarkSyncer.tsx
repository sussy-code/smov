import { useEffect } from "react";

import { addBookmark, removeBookmark } from "@/backend/accounts/bookmarks";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { AccountWithToken, useAuthStore } from "@/stores/auth";
import { BookmarkUpdateItem, useBookmarkStore } from "@/stores/bookmarks";

const syncIntervalMs = 5 * 1000;

async function syncBookmarks(
  items: BookmarkUpdateItem[],
  finish: (id: string) => void,
  url: string,
  account: AccountWithToken | null,
) {
  for (const item of items) {
    // complete it beforehand so it doesn't get handled while in progress
    finish(item.id);

    if (!account) continue; // not logged in, dont sync to server

    try {
      if (item.action === "delete") {
        await removeBookmark(url, account, item.tmdbId);
        continue;
      }

      if (item.action === "add") {
        await addBookmark(url, account, {
          meta: {
            poster: item.poster,
            title: item.title ?? "",
            type: item.type ?? "",
            year: item.year ?? NaN,
          },
          tmdbId: item.tmdbId,
        });
        continue;
      }
    } catch (err) {
      console.error(
        `Failed to sync bookmark: ${item.tmdbId} - ${item.action}`,
        err,
      );
    }
  }
}

export function BookmarkSyncer() {
  const clearUpdateQueue = useBookmarkStore((s) => s.clearUpdateQueue);
  const removeUpdateItem = useBookmarkStore((s) => s.removeUpdateItem);
  const url = useBackendUrl();

  // when booting for the first time, clear update queue.
  // we dont want to process persisted update items
  useEffect(() => {
    clearUpdateQueue();
  }, [clearUpdateQueue]);

  useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        const state = useBookmarkStore.getState();
        const user = useAuthStore.getState();
        await syncBookmarks(
          state.updateQueue,
          removeUpdateItem,
          url,
          user.account,
        );
      })();
    }, syncIntervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [removeUpdateItem, url]);

  return null;
}
