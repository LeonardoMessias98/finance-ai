import { describe, expect, it } from "vitest";

import {
  authPreparationRoutes,
  isFutureAuthenticationRoute,
  isFutureProtectedRoute,
  isPublicRoute
} from "@/lib/auth/route-access";

describe("route-access", () => {
  it("marca rotas financeiras como protegidas no futuro", () => {
    expect(isFutureProtectedRoute("/accounts")).toBe(true);
    expect(isFutureProtectedRoute("/transactions/edit")).toBe(true);
    expect(isFutureProtectedRoute("/")).toBe(false);
  });

  it("marca a rota de login futura separadamente", () => {
    expect(isFutureAuthenticationRoute("/login")).toBe(true);
    expect(isFutureAuthenticationRoute("/login/reset")).toBe(true);
    expect(isFutureAuthenticationRoute("/categories")).toBe(false);
  });

  it("mantem dashboard publico no MVP atual", () => {
    expect(isPublicRoute("/")).toBe(true);
    expect(isPublicRoute("/accounts")).toBe(false);
  });

  it("expoe a configuracao preparada para middleware futuro", () => {
    expect(authPreparationRoutes.futureProtectedRoutePrefixes).toContain("/accounts");
    expect(authPreparationRoutes.futureAuthenticationRoutePrefixes).toContain("/login");
  });
});
