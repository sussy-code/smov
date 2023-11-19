import { ofetch } from "ofetch";

import { getAuthHeaders } from "@/backend/accounts/auth";
import { ProgressResponse } from "@/backend/accounts/user";
import { AccountWithToken } from "@/stores/auth";

export interface ProgressInput {
  meta?: {
    title: string;
    year: number;
    poster?: string;
    type: string;
  };
  tmdbId: string;
  watched?: number;
  duration?: number;
  seasonId?: string;
  episodeId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
}

export async function setProgress(
  url: string,
  account: AccountWithToken,
  input: ProgressInput
) {
  return ofetch<ProgressResponse>(
    `/users/${account.userId}/progress/${input.tmdbId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(account.token),
      baseURL: url,
      body: input,
    }
  );
}

export async function removeProgress(
  url: string,
  account: AccountWithToken,
  id: string,
  episodeId?: string,
  seasonId?: string
) {
  await ofetch(`/users/${account.userId}/progress/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(account.token),
    baseURL: url,
    body: {
      episodeId,
      seasonId,
    },
  });
}
