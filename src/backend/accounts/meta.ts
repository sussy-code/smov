import { ofetch } from "ofetch";

export interface MetaResponse {
  version: string;
  name: string;
  description?: string;
  hasCaptcha: boolean;
  captchaClientKey?: string;
}

export async function getBackendMeta(url: string): Promise<MetaResponse> {
  return ofetch<MetaResponse>("/meta", {
    baseURL: url,
  });
}
