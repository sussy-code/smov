import { ExtensionMakeRequestBodyType } from "./plasmo";

export function getBodyTypeFromBody(
  body: unknown,
): ExtensionMakeRequestBodyType {
  if (typeof body === "string") return "string";
  if (body instanceof FormData) return "FormData";
  if (body instanceof URLSearchParams) return "URLSearchParams";
  if (typeof body === "object") return "object";
  return undefined;
}

export function convertBodyToObject(body: unknown): any {
  if (body instanceof FormData || body instanceof URLSearchParams) {
    const obj: Record<string, any> = {};
    for (const [key, value] of body.entries()) {
      obj[key] = value;
    }
    return obj;
  }
  return body;
}
