import { ofetch } from "ofetch";

import { getAuthHeaders } from "@/backend/accounts/auth";
import { BookmarkResponse } from "@/backend/accounts/user";
import { AccountWithToken } from "@/stores/auth";

export interface BookmarkInput {
  title: string;
  year: number;
  poster?: string;
  type: string;
  tmdbId: string;
}

export async function addBookmark(
  url: string,
  account: AccountWithToken,
  input: BookmarkInput
) {
  return ofetch<BookmarkResponse>(
    `/users/${account.userId}/bookmarks/${input.tmdbId}`,
    {
      method: "POST",
      headers: getAuthHeaders(account.token),
      baseURL: url,
      body: {
        meta: input,
        tmdbId: input.tmdbId,
      },
    }
  );
}

export async function removeBookmark(
  url: string,
  account: AccountWithToken,
  id: string
) {
  return ofetch<{ tmdbId: string }>(
    `/users/${account.userId}/bookmarks/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(account.token),
      baseURL: url,
    }
  );
}
