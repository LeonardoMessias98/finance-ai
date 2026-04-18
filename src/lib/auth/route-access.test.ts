import { describe, expect, it } from "vitest";

import {
  authRoutes,
  isAuthenticationRoute,
  isProtectedRoute,
  isPublicRoute
} from "@/lib/auth/route-access";

describe("route-access", () => {
  it("marca rotas financeiras como protegidas", () => {
    expect(isProtectedRoute("/accounts")).toBe(true);
    expect(isProtectedRoute("/transactions/edit")).toBe(true);
    expect(isProtectedRoute("/")).toBe(true);
  });

  it("marca a rota de login separadamente", () => {
    expect(isAuthenticationRoute("/login")).toBe(true);
    expect(isAuthenticationRoute("/login/reset")).toBe(true);
    expect(isAuthenticationRoute("/categories")).toBe(false);
  });

  it("trata o dashboard como privado com autenticacao", () => {
    expect(isPublicRoute("/")).toBe(false);
    expect(isPublicRoute("/accounts")).toBe(false);
  });

  it("expoe a configuracao usada pelo middleware", () => {
    expect(authRoutes.protectedRoutePrefixes).toContain("/accounts");
    expect(authRoutes.authenticationRoutePrefixes).toContain("/login");
  });
});
