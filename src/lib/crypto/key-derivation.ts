import { IV_LENGTH_BYTES, PBKDF2_ITERATIONS, SALT_LENGTH_BYTES } from "./constants";

export function generateSalt(): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
}

export function generateIv(): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
}

export async function deriveAesKey(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number = PBKDF2_ITERATIONS
): Promise<CryptoKey> {
  const passwordBytes = new TextEncoder().encode(password);

  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordBytes,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
