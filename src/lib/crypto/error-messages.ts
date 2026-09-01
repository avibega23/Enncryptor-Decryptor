import { CryptoError, CryptoErrorKind } from "@/types/crypto";

const MESSAGES: Record<CryptoErrorKind, string> = {
  "empty-file": "This file is empty. Please choose a file with content.",
  "wrong-file-type": "Please select a .secure file to decrypt.",
  "corrupt-file": "This file doesn't look like a valid encrypted file, or it's been corrupted.",
  "decryption-failed":
    "Incorrect password or corrupted file. Please check your password and try again.",
  "file-too-large":
    "This file is too large (over 1GB). Browser-based encryption can't safely handle files this size.",
  unknown: "Something went wrong during processing. Please try again.",
};

export function getErrorMessage(err: unknown): string {
  if (err instanceof CryptoError) {
    return MESSAGES[err.kind];
  }
  return MESSAGES.unknown;
}
