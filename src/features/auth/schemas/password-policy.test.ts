import { describe, expect, it } from "vitest";

import { clearTextPasswordSchema } from "@/features/auth/schemas/password-policy";

describe("password-policy", () => {
  it("aceita senha dentro do padrão definido pelo produto", () => {
    expect(clearTextPasswordSchema.safeParse("123456").success).toBe(true);
    expect(clearTextPasswordSchema.safeParse("senha123").success).toBe(true);
  });

  it("rejeita senha curta ou com espaços", () => {
    expect(clearTextPasswordSchema.safeParse("12345").success).toBe(false);
    expect(clearTextPasswordSchema.safeParse("123 456").success).toBe(false);
  });
});
