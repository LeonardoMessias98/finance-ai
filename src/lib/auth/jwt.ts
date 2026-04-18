import { createHmac } from "node:crypto";

import type { AccessTokenPayload } from "@/types/auth";

type VerifyAccessTokenResult =
  | {
      status: "valid";
      payload: AccessTokenPayload;
    }
  | {
      status: "invalid" | "expired";
    };

function toBase64Url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function createSignature(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function getJwtSecret(): string {
  const jwtSecret = process.env.AUTH_JWT_SECRET?.trim();

  if (!jwtSecret) {
    throw new Error("Defina AUTH_JWT_SECRET para habilitar autenticação.");
  }

  return jwtSecret;
}

export function createAccessToken(input: {
  userId: string;
  email: string;
  sessionId: string;
  expiresInSeconds: number;
}): string {
  const secret = getJwtSecret();
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: AccessTokenPayload = {
    sub: input.userId,
    email: input.email,
    sessionId: input.sessionId,
    type: "access",
    iat: issuedAt,
    exp: issuedAt + input.expiresInSeconds
  };
  const encodedHeader = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = createSignature(unsignedToken, secret);

  return `${unsignedToken}.${signature}`;
}

export function verifyAccessToken(token: string): VerifyAccessTokenResult {
  const secret = getJwtSecret();
  const parts = token.split(".");

  if (parts.length !== 3) {
    return {
      status: "invalid"
    };
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = createSignature(`${encodedHeader}.${encodedPayload}`, secret);

  if (signature !== expectedSignature) {
    return {
      status: "invalid"
    };
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as AccessTokenPayload;

    if (payload.type !== "access" || !payload.sub || !payload.sessionId || !payload.exp) {
      return {
        status: "invalid"
      };
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return {
        status: "expired"
      };
    }

    return {
      status: "valid",
      payload
    };
  } catch {
    return {
      status: "invalid"
    };
  }
}
