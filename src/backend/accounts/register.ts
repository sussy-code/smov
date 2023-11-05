import { ofetch } from "ofetch";

import { SessionResponse, UserResponse } from "@/backend/accounts/auth";
import {
  bytesToBase64Url,
  keysFromMenmonic as keysFromMnemonic,
  signCode,
} from "@/backend/accounts/crypto";

export interface ChallengeTokenResponse {
  challenge: string;
}

export async function getRegisterChallengeToken(
  url: string,
  captchaToken?: string
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
  data: RegisterInput
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

export async function signChallenge(mnemonic: string, challengeCode: string) {
  const keys = await keysFromMnemonic(mnemonic);
  const signature = await signCode(challengeCode, keys.privateKey);
  return {
    publicKey: bytesToBase64Url(keys.publicKey),
    signature: bytesToBase64Url(signature),
  };
}
