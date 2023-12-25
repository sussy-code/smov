import { ofetch } from "ofetch";

import { SessionResponse } from "@/backend/accounts/auth";
import { UserResponse } from "@/backend/accounts/user";

export interface ChallengeTokenResponse {
  challenge: string;
}

export async function getRegisterChallengeToken(
  url: string,
  captchaToken?: string,
): Promise<ChallengeTokenResponse> {
  return ofetch<ChallengeTokenResponse>("/auth/register/start", {
    method: "POST",
    body: {
      captchaToken,
    },
    baseURL: url,
  });
}

export interface RegisterResponse {
  user: UserResponse;
  session: SessionResponse;
  token: string;
}

export interface RegisterInput {
  publicKey: string;
  challenge: {
    code: string;
    signature: string;
  };
  device: string;
  profile: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

export async function registerAccount(
  url: string,
  data: RegisterInput,
): Promise<RegisterResponse> {
  return ofetch<RegisterResponse>("/auth/register/complete", {
    method: "POST",
    body: {
      namespace: "movie-web",
      ...data,
    },
    baseURL: url,
  });
}
