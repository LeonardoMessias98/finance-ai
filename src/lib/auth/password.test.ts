import { describe, expect, it } from "vitest";

import { compareSha256Hash, hashToken, isSha256Hash } from "@/lib/auth/password";

describe("password helpers", () => {
  it("reconhece hashes SHA-256 validos", () => {
    expect(isSha256Hash("8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92")).toBe(true);
    expect(isSha256Hash("123456")).toBe(false);
  });

  it("gera hash deterministico para tokens", () => {
    expect(hashToken("refresh-token")).toBe("0eb17643d4e9261163783a420859c92c7d212fa9624106a12b510afbec266120");
  });

  it("compara hashes normalizados com seguranca", () => {
    expect(
      compareSha256Hash(
        "8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92",
        "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
      )
    ).toBe(true);
    expect(
      compareSha256Hash(
        "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "0000000000000000000000000000000000000000000000000000000000000000"
      )
    ).toBe(false);
  });
});
