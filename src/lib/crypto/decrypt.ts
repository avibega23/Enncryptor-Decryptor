import { CryptoError, DecryptResult, ProgressStage } from "@/types/crypto";
import { FILE_EXTENSION } from "./constants";
import { parseSecureContainer } from "./container";
import { base64ToBuf } from "./encoding";
import { deriveAesKey } from "./key-derivation";

export async function decryptFile(
  file: File,
  password: string,
  onProgress?: (stage: ProgressStage, percent: number) => void
): Promise<DecryptResult> {
  if (file.size === 0) {
    throw new CryptoError({ kind: "empty-file" });
  }
  if (!file.name.toLowerCase().endsWith(FILE_EXTENSION)) {
    throw new CryptoError({ kind: "wrong-file-type" });
  }

  onProgress?.("reading", 0);
  const raw = await file.arrayBuffer();
  onProgress?.("reading", 100);

  const { header, ciphertext } = parseSecureContainer(raw);

  const salt = base64ToBuf(header.salt);
  const iv = base64ToBuf(header.iv);

  onProgress?.("deriving-key", 0);
  const key = await deriveAesKey(password, salt, header.iterations);
  onProgress?.("deriving-key", 100);

  onProgress?.("decrypting", 0);
  let plaintext: ArrayBuffer;
  try {
    plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  } catch (e) {
    throw new CryptoError({ kind: "decryption-failed", cause: e });
  }
  onProgress?.("decrypting", 100);
  onProgress?.("done", 100);

  return {
    blob: new Blob([plaintext], { type: header.mimeType }),
    filename: header.filename,
    mimeType: header.mimeType,
  };
}
