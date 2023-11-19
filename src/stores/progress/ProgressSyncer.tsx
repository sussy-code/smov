import { useEffect } from "react";

import { removeProgress, setProgress } from "@/backend/accounts/progress";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { AccountWithToken, useAuthStore } from "@/stores/auth";
import { ProgressUpdateItem, useProgressStore } from "@/stores/progress";

const syncIntervalMs = 5 * 1000;

async function syncProgress(
  items: ProgressUpdateItem[],
  finish: (id: string) => void,
  url: string,
  account: AccountWithToken | null
) {
  for (const item of items) {
    // complete it beforehand so it doesn't get handled while in progress
    finish(item.id);

    if (!account) return; // not logged in, dont sync to server

    try {
      if (item.action === "delete") {
        await removeProgress(
          url,
          account,
          item.tmdbId,
          item.seasonId,
          item.episodeId
        );
        continue;
      }

      if (item.action === "upsert") {
        await setProgress(url, account, {
          duration: item.progress?.duration ?? 0,
          watched: item.progress?.watched ?? 0,
          tmdbId: item.tmdbId,
          meta: {
            title: item.title ?? "",
            type: item.type ?? "",
            year: item.year ?? NaN,
            poster: item.poster,
          },
          episodeId: item.episodeId,
          seasonId: item.seasonId,
          episodeNumber: item.episodeNumber,
          seasonNumber: item.seasonNumber,
        });
        continue;
      }
    } catch (err) {
      console.error(
        `Failed to sync progress: ${item.tmdbId} - ${item.action}`,
        err
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
          user.account
        );
      })();
    }, syncIntervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [removeUpdateItem, url]);

  return null;
}
