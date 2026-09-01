import { CryptoError, SecureFileHeader } from "@/types/crypto";
import { MAGIC } from "./constants";

const MAGIC_BYTES_LENGTH = 8;
const HEADER_LENGTH_FIELD_BYTES = 4;

export function buildSecureContainer(header: SecureFileHeader, ciphertext: ArrayBuffer): Blob {
  const magicBytes = new TextEncoder().encode(MAGIC);
  const headerBytes = new TextEncoder().encode(JSON.stringify(header));

  const lengthPrefix = new ArrayBuffer(HEADER_LENGTH_FIELD_BYTES);
  new DataView(lengthPrefix).setUint32(0, headerBytes.byteLength, false);

  return new Blob([magicBytes, lengthPrefix, headerBytes, ciphertext]);
}

export function parseSecureContainer(buffer: ArrayBuffer): {
  header: SecureFileHeader;
  ciphertext: ArrayBuffer;
} {
  if (buffer.byteLength < MAGIC_BYTES_LENGTH + HEADER_LENGTH_FIELD_BYTES) {
    throw new CryptoError({ kind: "corrupt-file" });
  }

  const magic = new TextDecoder().decode(buffer.slice(0, MAGIC_BYTES_LENGTH));
  if (magic !== MAGIC) {
    throw new CryptoError({ kind: "corrupt-file" });
  }

  const headerLength = new DataView(buffer, MAGIC_BYTES_LENGTH, HEADER_LENGTH_FIELD_BYTES).getUint32(
    0,
    false
  );

  const headerStart = MAGIC_BYTES_LENGTH + HEADER_LENGTH_FIELD_BYTES;
  const headerEnd = headerStart + headerLength;

  if (headerEnd > buffer.byteLength) {
    throw new CryptoError({ kind: "corrupt-file" });
  }

  let header: SecureFileHeader;
  try {
    const headerJson = new TextDecoder().decode(buffer.slice(headerStart, headerEnd));
    header = JSON.parse(headerJson) as SecureFileHeader;
  } catch (e) {
    throw new CryptoError({ kind: "corrupt-file", cause: e });
  }

  if (header.version !== 1 || header.algorithm !== "AES-GCM-256") {
    throw new CryptoError({ kind: "corrupt-file" });
  }

  const ciphertext = buffer.slice(headerEnd);

  return { header, ciphertext };
}
