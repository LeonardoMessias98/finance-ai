import { describe, expect, it } from "vitest";

import { serializeAppSession } from "@/features/auth/utils/serialize-session";

describe("serialize-session", () => {
  it("serializa a sessao sem expor dados sensiveis", () => {
    const serializedSession = serializeAppSession({
      user: {
        id: "user-1",
        email: "owner@finance-ai.local",
        firstName: "Owner",
        lastName: "Finance AI",
        birthDate: new Date("1990-01-01T12:00:00.000Z"),
        sessionId: "session-1"
      },
      accessTokenExpiresAt: new Date("2030-01-01T00:00:00.000Z")
    });

    expect(serializedSession).toEqual({
      user: {
        id: "user-1",
        email: "owner@finance-ai.local",
        firstName: "Owner",
        lastName: "Finance AI",
        birthDate: "1990-01-01T12:00:00.000Z",
        sessionId: "session-1"
      },
      accessTokenExpiresAt: "2030-01-01T00:00:00.000Z"
    });
  });
});
