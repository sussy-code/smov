import { useEffect } from "react";

import {
  progressUpdateItemToInput,
  removeProgress,
  setProgress,
} from "@/backend/accounts/progress";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { AccountWithToken, useAuthStore } from "@/stores/auth";
import { ProgressUpdateItem, useProgressStore } from "@/stores/progress";

const syncIntervalMs = 5 * 1000;

async function syncProgress(
  items: ProgressUpdateItem[],
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
        await removeProgress(
          url,
          account,
          item.tmdbId,
          item.seasonId,
          item.episodeId,
        );
        continue;
      }

      if (item.action === "upsert") {
        await setProgress(url, account, progressUpdateItemToInput(item));
        continue;
      }
    } catch (err) {
      console.error(
        `Failed to sync progress: ${item.tmdbId} - ${item.action}`,
        err,
      );
    }
  }
}

export function ProgressSyncer() {
  const clearUpdateQueue = useProgressStore((s) => s.clearUpdateQueue);
  const removeUpdateItem = useProgressStore((s) => s.removeUpdateItem);
  const url = useBackendUrl();

  // when booting for the first time, clear update queue.
  // we dont want to process persisted update items
  useEffect(() => {
    clearUpdateQueue();
  }, [clearUpdateQueue]);

  useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        const state = useProgressStore.getState();
        const user = useAuthStore.getState();
        await syncProgress(
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
