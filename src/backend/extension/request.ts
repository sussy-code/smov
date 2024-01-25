import { ExtensionMakeRequestBodyType } from "./plasmo";

export function getBodyTypeFromBody(
  body: unknown,
): ExtensionMakeRequestBodyType {
  if (typeof body === "string") return "string";
  if (body instanceof FormData) return "FormData";
  if (body instanceof URLSearchParams) return "URLSearchParams";
  return "object";
}

export function convertBodyToObject(body: unknown): any {
  if (body instanceof FormData || body instanceof URLSearchParams) {
    return [...body];
  }
  return body;
}
