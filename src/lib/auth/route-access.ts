const futureProtectedRoutePrefixes = ["/accounts", "/budgets", "/categories", "/goals", "/transactions"] as const;
const futureAuthenticationRoutePrefixes = ["/login"] as const;

function matchesRoutePrefix(pathname: string, routePrefix: string): boolean {
  return pathname === routePrefix || pathname.startsWith(`${routePrefix}/`);
}

export function isFutureProtectedRoute(pathname: string): boolean {
  return futureProtectedRoutePrefixes.some((routePrefix) => matchesRoutePrefix(pathname, routePrefix));
}

export function isFutureAuthenticationRoute(pathname: string): boolean {
  return futureAuthenticationRoutePrefixes.some((routePrefix) => matchesRoutePrefix(pathname, routePrefix));
}

export function isPublicRoute(pathname: string): boolean {
  return !isFutureProtectedRoute(pathname);
}

export const authPreparationRoutes = {
  futureAuthenticationRoutePrefixes,
  futureProtectedRoutePrefixes
} as const;
