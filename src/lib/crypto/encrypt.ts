import { CryptoError, ProgressStage, SecureFileHeader } from "@/types/crypto";
import { MAX_FILE_SIZE_BYTES, PBKDF2_ITERATIONS } from "./constants";
import { buildSecureContainer } from "./container";
import { bufToBase64 } from "./encoding";
import { deriveAesKey, generateIv, generateSalt } from "./key-derivation";

export async function encryptFile(
  file: File,
  password: string,
  onProgress?: (stage: ProgressStage, percent: number) => void
): Promise<Blob> {
  if (file.size === 0) {
    throw new CryptoError({ kind: "empty-file" });
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new CryptoError({ kind: "file-too-large" });
  }

  onProgress?.("reading", 0);
  const plaintext = await file.arrayBuffer();
  onProgress?.("reading", 100);

  const salt = generateSalt();
  const iv = generateIv();

  onProgress?.("deriving-key", 0);
  const key = await deriveAesKey(password, salt);
  onProgress?.("deriving-key", 100);

  onProgress?.("encrypting", 0);
  let ciphertext: ArrayBuffer;
  try {
    ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  } catch (e) {
    throw new CryptoError({ kind: "unknown", cause: e });
  }
  onProgress?.("encrypting", 100);

  const header: SecureFileHeader = {
    version: 1,
    algorithm: "AES-GCM-256",
    kdf: "PBKDF2-SHA256",
    iterations: PBKDF2_ITERATIONS,
    salt: bufToBase64(salt),
    iv: bufToBase64(iv),
    filename: file.name,
    mimeType: file.type || "application/octet-stream",
    originalSize: file.size,
  };

  const blob = buildSecureContainer(header, ciphertext);
  onProgress?.("done", 100);
  return blob;
}
