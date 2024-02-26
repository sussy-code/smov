import { ofetch } from "ofetch";

import { SessionResponse } from "@/backend/accounts/auth";

export interface ChallengeTokenResponse {
  challenge: string;
}

export async function getLoginChallengeToken(
  url: string,
  publicKey: string,
): Promise<ChallengeTokenResponse> {
  return ofetch<ChallengeTokenResponse>("/auth/login/start", {
    method: "POST",
    body: {
      publicKey,
    },
    baseURL: url,
  });
}

export interface LoginResponse {
  session: SessionResponse;
  token: string;
}

export interface LoginInput {
  publicKey: string;
  challenge: {
    code: string;
    signature: string;
  };
  device: string;
}

export async function loginAccount(
  url: string,
  data: LoginInput,
): Promise<LoginResponse> {
  return ofetch<LoginResponse>("/auth/login/complete", {
    method: "POST",
    body: {
      namespace: "movie-web",
      ...data,
    },
    baseURL: url,
  });
}
