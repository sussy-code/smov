import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";
import { generateMnemonic, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import forge from "node-forge";

type Keys = {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
  seed: Uint8Array;
};

async function seedFromMnemonic(mnemonic: string) {
  return pbkdf2Async(sha256, mnemonic, "mnemonic", {
    c: 2048,
    dkLen: 32,
  });
}

export function verifyValidMnemonic(mnemonic: string) {
  return validateMnemonic(mnemonic, wordlist);
}

export async function keysFromMnemonic(mnemonic: string): Promise<Keys> {
  const seed = await seedFromMnemonic(mnemonic);

  const { privateKey, publicKey } = forge.pki.ed25519.generateKeyPair({
    seed,
  });

  return {
    privateKey,
    publicKey,
    seed,
  };
}

export function genMnemonic(): string {
  return generateMnemonic(wordlist);
}

export async function signCode(
  code: string,
  privateKey: Uint8Array,
): Promise<Uint8Array> {
  return forge.pki.ed25519.sign({
    encoding: "utf8",
    message: code,
    privateKey,
  });
}

export function bytesToBase64(bytes: Uint8Array) {
  return forge.util.encode64(String.fromCodePoint(...bytes));
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes)
    .replace(/\//g, "_")
    .replace(/\+/g, "-")
    .replace(/=+$/, "");
}

export async function signChallenge(keys: Keys, challengeCode: string) {
  const signature = await signCode(challengeCode, keys.privateKey);
  return bytesToBase64Url(signature);
}

export function base64ToBuffer(data: string) {
  return forge.util.binary.base64.decode(data);
}

export function base64ToStringBuffer(data: string) {
  return forge.util.createBuffer(base64ToBuffer(data));
}

export function stringBufferToBase64(buffer: forge.util.ByteStringBuffer) {
  return forge.util.encode64(buffer.getBytes());
}

export async function encryptData(data: string, secret: Uint8Array) {
  if (secret.byteLength !== 32)
    throw new Error("Secret must be at least 256-bit");

  const iv = await new Promise<string>((resolve, reject) => {
    forge.random.getBytes(16, (err, bytes) => {
      if (err) reject(err);
      resolve(bytes);
    });
  });

  const cipher = forge.cipher.createCipher(
    "AES-GCM",
    forge.util.createBuffer(secret),
  );
  cipher.start({
    iv,
    tagLength: 128,
  });
  cipher.update(forge.util.createBuffer(data, "utf8"));
  cipher.finish();

  const encryptedData = cipher.output;
  const tag = cipher.mode.tag;

  return `${forge.util.encode64(iv)}.${stringBufferToBase64(
    encryptedData,
  )}.${stringBufferToBase64(tag)}` as const;
}

export function decryptData(data: string, secret: Uint8Array) {
  if (secret.byteLength !== 32) throw new Error("Secret must be 256-bit");

  const [iv, encryptedData, tag] = data.split(".");

  const decipher = forge.cipher.createDecipher(
    "AES-GCM",
    forge.util.createBuffer(secret),
  );
  decipher.start({
    iv: base64ToStringBuffer(iv),
    tag: base64ToStringBuffer(tag),
    tagLength: 128,
  });
  decipher.update(base64ToStringBuffer(encryptedData));
  const pass = decipher.finish();

  if (!pass) throw new Error("Error decrypting data");

  return decipher.output.toString();
}
