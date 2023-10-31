import { ofetch } from "ofetch";

export interface SessionResponse {
  id: string;
  userId: string;
  createdAt: string;
  accessedAt: string;
  device: string;
  userAgent: string;
}

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

export interface LoginResponse {
  session: SessionResponse;
  token: string;
}

function getAuthHeaders(token: string): Record<string, string> {
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

export async function getUser(
  url: string,
  token: string
): Promise<UserResponse> {
  return ofetch<UserResponse>("/user/@me", {
    headers: getAuthHeaders(token),
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
