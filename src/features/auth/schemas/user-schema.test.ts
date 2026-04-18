import { describe, expect, it } from "vitest";

import { createUserSchema } from "@/features/auth/schemas/user-schema";

describe("user-schema", () => {
  it("aceita usuario com campos opcionais de ultimo acesso ausentes", () => {
    const result = createUserSchema.safeParse({
      firstName: "Messias",
      lastName: "Leonardo",
      birthDate: new Date("1998-01-01T12:00:00.000Z"),
      email: "OWNER@Finance-AI.Local",
      passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.email).toBe("owner@finance-ai.local");
  });
});
