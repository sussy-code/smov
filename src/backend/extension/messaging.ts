import {
  MessagesMetadata,
  sendToBackgroundViaRelay,
} from "@plasmohq/messaging";

import { isAllowedExtensionVersion } from "@/backend/extension/compatibility";

let activeExtension = false;

function sendMessage<MessageKey extends keyof MessagesMetadata>(
  message: MessageKey,
  payload: MessagesMetadata[MessageKey]["req"],
  timeout: number = -1,
) {
  return new Promise<MessagesMetadata[MessageKey]["res"] | null>((resolve) => {
    if (timeout >= 0) setTimeout(() => resolve(null), timeout);
    sendToBackgroundViaRelay<
      MessagesMetadata[MessageKey]["req"],
      MessagesMetadata[MessageKey]["res"]
    >({
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
  ops: Omit<MessagesMetadata["makeRequest"]["req"], "requestDomain">,
): Promise<MessagesMetadata["makeRequest"]["res"] | null> {
  return sendMessage("makeRequest", {
    requestDomain: window.location.origin,
    ...ops,
  });
}

export async function setDomainRule(
  ops: Omit<MessagesMetadata["prepareStream"]["req"], "requestDomain">,
): Promise<MessagesMetadata["prepareStream"]["res"] | null> {
  return sendMessage("prepareStream", {
    requestDomain: window.location.origin,
    ...ops,
  });
}

export async function extensionInfo(): Promise<
  MessagesMetadata["hello"]["res"] | null
> {
  return sendMessage(
    "hello",
    {
      requestDomain: window.location.origin,
    },
    300,
  );
}

export function isExtensionActiveCached(): boolean {
  return activeExtension;
}

export async function isExtensionActive(): Promise<boolean> {
  const info = await extensionInfo();
  if (!info?.success) return false;
  const allowedVersion = isAllowedExtensionVersion(info.version);
  if (!allowedVersion) return false;
  return true;
}
