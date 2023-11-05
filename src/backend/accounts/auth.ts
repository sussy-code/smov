import { ofetch } from "ofetch";

import { UserResponse } from "@/backend/accounts/user";

export interface SessionResponse {
  id: string;
  userId: string;
  createdAt: string;
  accessedAt: string;
  device: string;
  userAgent: string;
}
export interface LoginResponse {
  session: SessionResponse;
  token: string;
}

export function getAuthHeaders(token: string): Record<string, string> {
  return {
    authorization: `Bearer ${token}`,
  };
}

export async function accountLogin(
  url: string,
  id: string,
  deviceName: string
): Promise<LoginResponse> {
  return ofetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: {
      id,
      device: deviceName,
    },
    baseURL: url,
  });
}

export async function removeSession(
  url: string,
  token: string,
  sessionId: string
): Promise<UserResponse> {
  return ofetch<UserResponse>(`/sessions/${sessionId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
    baseURL: url,
  });
}
