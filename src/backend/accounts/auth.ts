import { ofetch } from "ofetch";

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
  deviceName: string,
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
