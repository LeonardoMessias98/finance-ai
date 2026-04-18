import { createHash, timingSafeEqual } from "node:crypto";

const sha256HashRegex = /^[a-f0-9]{64}$/i;

export function isSha256Hash(value: string): boolean {
  return sha256HashRegex.test(value.trim());
}

export function hashToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function compareSha256Hash(left: string, right: string): boolean {
  const normalizedLeft = left.trim().toLowerCase();
  const normalizedRight = right.trim().toLowerCase();

  if (!isSha256Hash(normalizedLeft) || !isSha256Hash(normalizedRight)) {
    return false;
  }

  return timingSafeEqual(Buffer.from(normalizedLeft), Buffer.from(normalizedRight));
}
