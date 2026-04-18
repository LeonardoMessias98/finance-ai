import "server-only";

import { randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";

import {
  createRefreshToken,
  findActiveRefreshTokenByHash,
  revokeRefreshTokenById,
  revokeRefreshTokensBySessionId,
  revokeRefreshTokensByUserId
} from "@/features/auth/repositories/refresh-token-repository";
import {
  clearUserActiveSession,
  findUserById,
  updateUserActiveSession,
  type AuthUser
} from "@/features/auth/repositories/user-repository";
import {
  authCookieNames,
  getAccessTokenCookieOptions,
  getAccessTokenMaxAgeSeconds,
  getRefreshTokenCookieOptions,
  getRefreshTokenMaxAgeSeconds
} from "@/lib/auth/cookies";
import { createAccessToken, verifyAccessToken } from "@/lib/auth/jwt";
import { hashToken } from "@/lib/auth/password";
import { getRequestClientContext } from "@/lib/auth/request-context";
import type { AppSession, AuthenticatedAppUser } from "@/types/auth";

export class AuthenticationRequiredError extends Error {
  constructor(message = "Sessão inválida ou expirada.") {
    super(message);
    this.name = "AuthenticationRequiredError";
  }
}

async function getCookieStore() {
  return cookies();
}

function getRefreshTokenExpiryDate(): Date {
  return new Date(Date.now() + getRefreshTokenMaxAgeSeconds() * 1000);
}

function getAccessTokenExpiryDate(): Date {
  return new Date((Math.floor(Date.now() / 1000) + getAccessTokenMaxAgeSeconds()) * 1000);
}

function mapAuthenticatedUser(user: AuthUser, sessionId: string): AuthenticatedAppUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    birthDate: user.birthDate,
    sessionId
  };
}

function createAppSession(user: AuthUser, sessionId: string, accessTokenExpiresAt: Date): AppSession {
  return {
    user: mapAuthenticatedUser(user, sessionId),
    accessTokenExpiresAt
  };
}

export async function clearAuthenticationCookies(): Promise<void> {
  const cookieStore = await getCookieStore();

  cookieStore.delete(authCookieNames.accessToken);
  cookieStore.delete(authCookieNames.refreshToken);
}

export async function createUserSession(input: {
  user: AuthUser;
  ip: string;
  location?: string;
  userAgent: string;
}): Promise<AppSession> {
  const sessionId = randomUUID();
  const refreshToken = randomBytes(32).toString("base64url");
  const accessTokenExpiresAt = getAccessTokenExpiryDate();
  const accessToken = createAccessToken({
    userId: input.user.id,
    email: input.user.email,
    sessionId,
    expiresInSeconds: getAccessTokenMaxAgeSeconds()
  });
  const cookieStore = await getCookieStore();

  await revokeRefreshTokensByUserId(input.user.id);
  await updateUserActiveSession({
    userId: input.user.id,
    sessionId,
    lastLoginIp: input.ip,
    lastLoginLocation: input.location
  });
  await createRefreshToken({
    userId: input.user.id,
    sessionId,
    tokenHash: hashToken(refreshToken),
    ip: input.ip,
    location: input.location,
    userAgent: input.userAgent,
    expiresAt: getRefreshTokenExpiryDate()
  });

  cookieStore.set(authCookieNames.accessToken, accessToken, getAccessTokenCookieOptions());
  cookieStore.set(authCookieNames.refreshToken, refreshToken, getRefreshTokenCookieOptions());

  return createAppSession(input.user, sessionId, accessTokenExpiresAt);
}

export async function revokeCurrentSession(): Promise<void> {
  const cookieStore = await getCookieStore();
  const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
  let userId: string | null = null;
  let sessionId: string | null = null;

  if (accessToken) {
    const verificationResult = verifyAccessToken(accessToken);

    if (verificationResult.status === "valid") {
      userId = verificationResult.payload.sub;
      sessionId = verificationResult.payload.sessionId;
    }
  }

  if (refreshToken) {
    const persistedRefreshToken = await findActiveRefreshTokenByHash(hashToken(refreshToken));

    if (persistedRefreshToken) {
      userId = persistedRefreshToken.userId;
      sessionId = persistedRefreshToken.sessionId;
      await revokeRefreshTokensBySessionId({
        userId: persistedRefreshToken.userId,
        sessionId: persistedRefreshToken.sessionId
      });
    }
  }

  if (userId && sessionId) {
    await clearUserActiveSession({
      userId,
      expectedSessionId: sessionId
    });
  }

  await clearAuthenticationCookies();
}

export async function refreshCurrentSession(): Promise<AppSession | null> {
  const cookieStore = await getCookieStore();
  const persistedToken = cookieStore.get(authCookieNames.refreshToken)?.value;

  if (!persistedToken) {
    return null;
  }

  const refreshTokenRecord = await findActiveRefreshTokenByHash(hashToken(persistedToken));

  if (!refreshTokenRecord) {
    await clearAuthenticationCookies();
    return null;
  }

  const user = await findUserById(refreshTokenRecord.userId);

  if (!user || user.activeSessionId !== refreshTokenRecord.sessionId) {
    await revokeRefreshTokenById(refreshTokenRecord.id);
    await clearAuthenticationCookies();
    return null;
  }

  const nextRefreshToken = randomBytes(32).toString("base64url");
  const accessTokenExpiresAt = getAccessTokenExpiryDate();
  const accessToken = createAccessToken({
    userId: user.id,
    email: user.email,
    sessionId: refreshTokenRecord.sessionId,
    expiresInSeconds: getAccessTokenMaxAgeSeconds()
  });
  const clientContext = await getRequestClientContext();

  await revokeRefreshTokenById(refreshTokenRecord.id);
  await createRefreshToken({
    userId: user.id,
    sessionId: refreshTokenRecord.sessionId,
    tokenHash: hashToken(nextRefreshToken),
    ip: clientContext.ip,
    location: clientContext.location,
    userAgent: clientContext.userAgent,
    expiresAt: getRefreshTokenExpiryDate()
  });

  cookieStore.set(authCookieNames.accessToken, accessToken, getAccessTokenCookieOptions());
  cookieStore.set(authCookieNames.refreshToken, nextRefreshToken, getRefreshTokenCookieOptions());

  return createAppSession(user, refreshTokenRecord.sessionId, accessTokenExpiresAt);
}

export async function getAuthenticatedSessionFromCookies(): Promise<AppSession | null> {
  const cookieStore = await getCookieStore();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

  if (!accessToken) {
    return null;
  }

  const verificationResult = verifyAccessToken(accessToken);

  if (verificationResult.status !== "valid") {
    return null;
  }

  const user = await findUserById(verificationResult.payload.sub);

  if (!user || user.activeSessionId !== verificationResult.payload.sessionId) {
    return null;
  }

  return createAppSession(user, verificationResult.payload.sessionId, new Date(verificationResult.payload.exp * 1000));
}

export async function getAuthenticatedUserFromCookies(): Promise<AuthUser | null> {
  const session = await getAuthenticatedSessionFromCookies();

  if (!session) {
    return null;
  }

  return findUserById(session.user.id);
}
