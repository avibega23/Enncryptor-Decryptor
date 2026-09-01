export interface SecureFileHeader {
  version: 1;
  algorithm: "AES-GCM-256";
  kdf: "PBKDF2-SHA256";
  iterations: number;
  salt: string;
  iv: string;
  filename: string;
  mimeType: string;
  originalSize: number;
}

export type CryptoErrorKind =
  | "empty-file"
  | "wrong-file-type"
  | "corrupt-file"
  | "decryption-failed"
  | "file-too-large"
  | "unknown";

export class CryptoError extends Error {
  kind: CryptoErrorKind;
  cause?: unknown;

  constructor(opts: { kind: CryptoErrorKind; message?: string; cause?: unknown }) {
    super(opts.message ?? opts.kind);
    this.name = "CryptoError";
    this.kind = opts.kind;
    this.cause = opts.cause;
  }
}

export type ProgressStage = "reading" | "deriving-key" | "encrypting" | "decrypting" | "done";

export interface ProgressUpdate {
  stage: ProgressStage;
  percent: number;
}

export type PasswordStrength = "very-weak" | "weak" | "fair" | "strong" | "very-strong";

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number;
  feedback: string[];
}

export interface DecryptResult {
  blob: Blob;
  filename: string;
  mimeType: string;
}
