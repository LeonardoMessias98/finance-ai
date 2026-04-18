import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createAccessToken, verifyAccessToken } from "@/lib/auth/jwt";

const originalJwtSecret = process.env.AUTH_JWT_SECRET;

describe("jwt helpers", () => {
  beforeEach(() => {
    process.env.AUTH_JWT_SECRET = "test-secret";
  });

  afterEach(() => {
    if (originalJwtSecret) {
      process.env.AUTH_JWT_SECRET = originalJwtSecret;
      return;
    }

    delete process.env.AUTH_JWT_SECRET;
  });

  it("cria e valida access token", () => {
    const token = createAccessToken({
      userId: "user-id",
      email: "owner@finance-ai.local",
      sessionId: "session-id",
      expiresInSeconds: 60
    });
    const result = verifyAccessToken(token);

    expect(result.status).toBe("valid");

    if (result.status !== "valid") {
      return;
    }

    expect(result.payload.sub).toBe("user-id");
    expect(result.payload.email).toBe("owner@finance-ai.local");
    expect(result.payload.sessionId).toBe("session-id");
    expect(result.payload.type).toBe("access");
  });

  it("marca token expirado", () => {
    const token = createAccessToken({
      userId: "user-id",
      email: "owner@finance-ai.local",
      sessionId: "session-id",
      expiresInSeconds: -1
    });

    expect(verifyAccessToken(token)).toEqual({
      status: "expired"
    });
  });

  it("rejeita token adulterado", () => {
    const token = createAccessToken({
      userId: "user-id",
      email: "owner@finance-ai.local",
      sessionId: "session-id",
      expiresInSeconds: 60
    });
    const tamperedToken = `${token.slice(0, -1)}x`;

    expect(verifyAccessToken(tamperedToken)).toEqual({
      status: "invalid"
    });
  });
});
