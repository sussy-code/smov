import {
  MessagesMetadata,
  sendToBackgroundViaRelay,
} from "@plasmohq/messaging";

let activeExtension = false;

export interface ExtensionHello {
  version: string;
}

function sendMessage<T, Payload>(
  message: keyof MessagesMetadata,
  payload: any,
  timeout: number = -1,
) {
  return new Promise<T | null>((resolve) => {
    if (timeout >= 0) setTimeout(() => resolve(null), timeout);
    sendToBackgroundViaRelay<Payload, T>({
      name: message,
      body: payload,
    })
      .then((res) => {
        activeExtension = true;
        resolve(res);
      })
      .catch(() => {
        activeExtension = false;
        resolve(null);
      });
  });
}

export async function sendExtensionRequest(
  url: string,
  ops: any,
): Promise<ExtensionHello | null> {
  return sendMessage("proxy-request", { url, ...ops });
}

export async function extensionInfo(): Promise<ExtensionHello | null> {
  return sendMessage("hello", null, 300);
}

export function isExtensionActiveCached(): boolean {
  return activeExtension;
}

export async function isExtensionActive(): Promise<boolean> {
  return !!(await extensionInfo());
}
