import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import forge from "node-forge";
import { encode } from "universal-base64url";

async function seedFromMnemonic(mnemonic: string) {
  const md = forge.md.sha256.create();
  md.update(mnemonic);
  // TODO this is probably not correct
  return md.digest().toHex();
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
  _code: string,
  _privateKey: forge.pki.ed25519.NativeBuffer
): Promise<Uint8Array> {
  // TODO add real signature
  return new Uint8Array();
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  return encode(String.fromCodePoint(...bytes));
}
