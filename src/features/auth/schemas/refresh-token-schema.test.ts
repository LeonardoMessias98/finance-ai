import { describe, expect, it } from "vitest";

import { createRefreshTokenSchema } from "@/features/auth/schemas/refresh-token-schema";

describe("refresh-token-schema", () => {
  it("exige metadados do token persistido", () => {
    const validResult = createRefreshTokenSchema.safeParse({
      userId: "507f1f77bcf86cd799439011",
      sessionId: "session-id",
      tokenHash: "0eb17643d4e9261163783a420859c92c7d212fa9624106a12b510afbec266120",
      ip: "127.0.0.1",
      location: "Sao Paulo, BR",
      userAgent: "Mozilla/5.0",
      expiresAt: new Date("2030-01-01T00:00:00.000Z")
    });
    const invalidResult = createRefreshTokenSchema.safeParse({
      userId: "507f1f77bcf86cd799439011",
      sessionId: "session-id",
      tokenHash: "invalid",
      ip: "",
      userAgent: "",
      expiresAt: new Date("2030-01-01T00:00:00.000Z")
    });

    expect(validResult.success).toBe(true);
    expect(invalidResult.success).toBe(false);
  });
});
