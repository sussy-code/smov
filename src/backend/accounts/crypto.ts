import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";
import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import forge from "node-forge";

async function seedFromMnemonic(mnemonic: string) {
  return pbkdf2Async(sha256, mnemonic, "mnemonic", {
    c: 2048,
    dkLen: 32,
  });
}

export async function keysFromMenmonic(mnemonic: string) {
  const seed = await seedFromMnemonic(mnemonic);

  const { privateKey, publicKey } = forge.pki.ed25519.generateKeyPair({
    seed,
  });

  return {
    privateKey,
    publicKey,
  };
}

export function genMnemonic(): string {
  return generateMnemonic(wordlist);
}

export async function signCode(
  code: string,
  privateKey: forge.pki.ed25519.NativeBuffer
): Promise<forge.pki.ed25519.NativeBuffer> {
  return forge.pki.ed25519.sign({
    encoding: "utf8",
    message: code,
    privateKey,
  });
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCodePoint(...bytes))
    .replace(/\//g, "_")
    .replace(/\+/g, "-")
    .replace(/=+$/, "");
}
