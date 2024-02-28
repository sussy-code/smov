import {
  MessagesMetadata,
  sendToBackgroundViaRelay,
} from "@plasmohq/messaging";

import { isAllowedExtensionVersion } from "@/backend/extension/compatibility";
import { ExtensionMakeRequestResponse } from "@/backend/extension/plasmo";

export const RULE_IDS = {
  PREPARE_STREAM: 1,
  SET_DOMAINS_HLS: 2,
};

// for some reason, about 500 ms is needed after
// page load before the extension starts responding properly
const isExtensionReady = new Promise<void>((resolve) => {
  setTimeout(() => {
    resolve();
  }, 500);
});

let activeExtension = false;

async function sendMessage<MessageKey extends keyof MessagesMetadata>(
  message: MessageKey,
  payload: MessagesMetadata[MessageKey]["req"] | undefined = undefined,
  timeout: number = -1,
) {
  await isExtensionReady;
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

export async function sendExtensionRequest<T>(
  ops: MessagesMetadata["makeRequest"]["req"],
): Promise<ExtensionMakeRequestResponse<T> | null> {
  return sendMessage("makeRequest", ops);
}

export async function setDomainRule(
  ops: MessagesMetadata["prepareStream"]["req"],
): Promise<MessagesMetadata["prepareStream"]["res"] | null> {
  return sendMessage("prepareStream", ops);
}

export async function sendPage(
  ops: MessagesMetadata["openPage"]["req"],
): Promise<MessagesMetadata["openPage"]["res"] | null> {
  return sendMessage("openPage", ops);
}

export async function extensionInfo(): Promise<
  MessagesMetadata["hello"]["res"] | null
> {
  const message = await sendMessage("hello", undefined, 500);
  return message;
}

export function isExtensionActiveCached(): boolean {
  return activeExtension;
}

export async function isExtensionActive(): Promise<boolean> {
  const info = await extensionInfo();
  if (!info?.success) return false;
  const allowedVersion = isAllowedExtensionVersion(info.version);
  if (!allowedVersion) return false;
  return info.allowed && info.hasPermission;
}
