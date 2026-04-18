import "server-only";

import type { AppSession, AuthenticatedAppUser } from "@/types/auth";
import {
  AuthenticationRequiredError,
  getAuthenticatedSessionFromCookies
} from "@/lib/auth/session-cookies";

export async function getOptionalAuthenticatedAppUser(): Promise<AuthenticatedAppUser | null> {
  const session = await getAuthenticatedSessionFromCookies();

  if (!session) {
    return null;
  }

  return session.user;
}

export async function getOptionalAppSession(): Promise<AppSession | null> {
  return getAuthenticatedSessionFromCookies();
}

export async function requireAuthenticatedAppUser(): Promise<AuthenticatedAppUser> {
  const user = await getOptionalAuthenticatedAppUser();

  if (!user) {
    throw new AuthenticationRequiredError();
  }

  return user;
}

export function isAuthenticationRequiredError(error: unknown): error is AuthenticationRequiredError {
  return error instanceof AuthenticationRequiredError;
}
