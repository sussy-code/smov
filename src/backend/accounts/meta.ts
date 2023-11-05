import { ofetch } from "ofetch";

export interface MetaResponse {
  name: string;
  description?: string;
  hasCaptcha: boolean;
}

export async function getBackendMeta(url: string): Promise<MetaResponse> {
  return ofetch<MetaResponse>("/meta", {
    baseURL: url,
  });
}
