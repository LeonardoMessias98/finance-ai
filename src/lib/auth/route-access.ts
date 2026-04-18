const protectedRoutePrefixes = ["/", "/accounts", "/budgets", "/categories", "/goals", "/transactions"] as const;
const authenticationRoutePrefixes = ["/login"] as const;

function matchesRoutePrefix(pathname: string, routePrefix: string): boolean {
  return pathname === routePrefix || pathname.startsWith(`${routePrefix}/`);
}

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutePrefixes.some((routePrefix) => matchesRoutePrefix(pathname, routePrefix));
}

export function isAuthenticationRoute(pathname: string): boolean {
  return authenticationRoutePrefixes.some((routePrefix) => matchesRoutePrefix(pathname, routePrefix));
}

export function isPublicRoute(pathname: string): boolean {
  return !isProtectedRoute(pathname);
}

export const authRoutes = {
  authenticationRoutePrefixes,
  protectedRoutePrefixes
} as const;

export const isFutureProtectedRoute = isProtectedRoute;
export const isFutureAuthenticationRoute = isAuthenticationRoute;
export const authPreparationRoutes = authRoutes;
