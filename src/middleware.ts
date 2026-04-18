import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { authCookieNames } from "@/lib/auth/cookies";
import { isProtectedRoute } from "@/lib/auth/route-access";

function buildNextPathname(request: NextRequest): string {
  return `${request.nextUrl.pathname}${request.nextUrl.search}`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccessToken = Boolean(request.cookies.get(authCookieNames.accessToken)?.value);

  if (!isProtectedRoute(pathname) || hasAccessToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);

  loginUrl.searchParams.set("next", buildNextPathname(request));

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"]
};
