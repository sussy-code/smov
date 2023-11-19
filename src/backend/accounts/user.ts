import { ofetch } from "ofetch";

import { SessionResponse, getAuthHeaders } from "@/backend/accounts/auth";
import { AccountWithToken } from "@/stores/auth";
import { BookmarkMediaItem } from "@/stores/bookmarks";
import { ProgressMediaItem } from "@/stores/progress";

export interface UserResponse {
  id: string;
  namespace: string;
  name: string;
  roles: string[];
  createdAt: string;
  profile: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

export interface BookmarkResponse {
  tmdbId: string;
  meta: {
    title: string;
    year: number;
    poster?: string;
    type: "show" | "movie";
  };
  updatedAt: string;
}

export interface ProgressResponse {
  tmdbId: string;
  seasonId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeId?: string;
  meta: {
    title: string;
    year: number;
    poster?: string;
    type: "show" | "movie";
  };
  duration: number;
  watched: number;
  updatedAt: string;
}

export function bookmarkResponsesToEntries(responses: BookmarkResponse[]) {
  const entries = responses.map((bookmark) => {
    const item: BookmarkMediaItem = {
      ...bookmark.meta,
      updatedAt: new Date(bookmark.updatedAt).getTime(),
    };
    return [bookmark.tmdbId, item] as const;
  });

  return Object.fromEntries(entries);
}

export function progressResponsesToEntries(responses: ProgressResponse[]) {
  const items: Record<string, ProgressMediaItem> = {};

  responses.forEach((v) => {
    if (!items[v.tmdbId]) {
      items[v.tmdbId] = {
        title: v.meta.title,
        poster: v.meta.poster,
        type: v.meta.type,
        updatedAt: new Date(v.updatedAt).getTime(),
        episodes: {},
        seasons: {},
        year: v.meta.year,
      };
    }

    const item = items[v.tmdbId];
    if (item.type === "movie") {
      item.progress = {
        duration: v.duration,
        watched: v.watched,
      };
    }

    if (item.type === "show" && v.seasonId && v.episodeId) {
      item.seasons[v.seasonId] = {
        id: v.seasonId,
        number: v.seasonNumber ?? 0,
        title: "",
      };
      item.episodes[v.episodeId] = {
        id: v.seasonId,
        number: v.episodeNumber ?? 0,
        title: "",
        progress: {
          duration: v.duration,
          watched: v.watched,
        },
        seasonId: v.seasonId,
        updatedAt: new Date(v.updatedAt).getTime(),
      };
    }
  });

  return items;
}

export async function getUser(
  url: string,
  token: string
): Promise<{ user: UserResponse; session: SessionResponse }> {
  return ofetch<{ user: UserResponse; session: SessionResponse }>(
    "/users/@me",
    {
      headers: getAuthHeaders(token),
      baseURL: url,
    }
  );
}

export async function deleteUser(
  url: string,
  account: AccountWithToken
): Promise<UserResponse> {
  return ofetch<UserResponse>(`/users/${account.userId}`, {
    headers: getAuthHeaders(account.token),
    baseURL: url,
  });
}

export async function getBookmarks(url: string, account: AccountWithToken) {
  return ofetch<BookmarkResponse[]>(`/users/${account.userId}/bookmarks`, {
    headers: getAuthHeaders(account.token),
    baseURL: url,
  });
}

export async function getProgress(url: string, account: AccountWithToken) {
  return ofetch<ProgressResponse[]>(`/users/${account.userId}/progress`, {
    headers: getAuthHeaders(account.token),
    baseURL: url,
  });
}
