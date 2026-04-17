import "server-only";

import type { AppSession, AuthenticatedAppUser } from "@/types/auth";

const AUTH_NOT_CONFIGURED_MESSAGE =
  "Autenticação ainda não configurada. Implemente Auth.js antes de exigir sessão autenticada.";

export async function getOptionalAuthenticatedAppUser(): Promise<AuthenticatedAppUser | null> {
  return null;
}

export async function getOptionalAppSession(): Promise<AppSession | null> {
  const user = await getOptionalAuthenticatedAppUser();

  if (!user) {
    return null;
  }

  return {
    user
  };
}

export async function requireAuthenticatedAppUser(): Promise<AuthenticatedAppUser> {
  const user = await getOptionalAuthenticatedAppUser();

  if (!user) {
    throw new Error(AUTH_NOT_CONFIGURED_MESSAGE);
  }

  return user;
}
