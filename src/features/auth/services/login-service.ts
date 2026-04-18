import "server-only";

import { findUserByEmail } from "@/features/auth/repositories/user-repository";
import { compareSha256Hash } from "@/lib/auth/password";
import { createUserSession } from "@/lib/auth/session-cookies";
import { getRequestClientContext } from "@/lib/auth/request-context";
import type { AppSession } from "@/types/auth";

export class InvalidCredentialsError extends Error {
  constructor(message = "Email ou senha inválidos.") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export async function loginWithEmailAndPasswordHash(input: {
  email: string;
  passwordHash: string;
}): Promise<AppSession> {
  const user = await findUserByEmail(input.email);
  console.log({ passwordHash: input.passwordHash});
  if (!user || !compareSha256Hash(input.passwordHash, user.passwordHash)) {
    throw new InvalidCredentialsError();
  }

  const clientContext = await getRequestClientContext();

  return createUserSession({
    user,
    ip: clientContext.ip,
    location: clientContext.location,
    userAgent: clientContext.userAgent
  });
}
