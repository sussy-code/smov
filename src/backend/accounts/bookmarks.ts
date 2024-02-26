import { ofetch } from "ofetch";

import { getAuthHeaders } from "@/backend/accounts/auth";
import { BookmarkResponse } from "@/backend/accounts/user";
import { AccountWithToken } from "@/stores/auth";
import { BookmarkMediaItem } from "@/stores/bookmarks";

export interface BookmarkMetaInput {
  title: string;
  year: number;
  poster?: string;
  type: string;
}

export interface BookmarkInput {
  tmdbId: string;
  meta: BookmarkMetaInput;
}

export function bookmarkMediaToInput(
  tmdbId: string,
  item: BookmarkMediaItem,
): BookmarkInput {
  return {
    meta: {
      title: item.title,
      type: item.type,
      poster: item.poster,
      year: item.year ?? 0,
    },
    tmdbId,
  };
}

export async function addBookmark(
  url: string,
  account: AccountWithToken,
  input: BookmarkInput,
) {
  return ofetch<BookmarkResponse>(
    `/users/${account.userId}/bookmarks/${input.tmdbId}`,
    {
      method: "POST",
      headers: getAuthHeaders(account.token),
      baseURL: url,
      body: input,
    },
  );
}

export async function removeBookmark(
  url: string,
  account: AccountWithToken,
  id: string,
) {
  return ofetch<{ tmdbId: string }>(
    `/users/${account.userId}/bookmarks/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(account.token),
      baseURL: url,
    },
  );
}
