const oneHourInSeconds = 60 * 60;
const refreshTokenLifetimeInSeconds = 60 * 60 * 24 * 30;

export const authCookieNames = {
  accessToken: "finance_ai_access_token",
  refreshToken: "finance_ai_refresh_token"
} as const;

function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getAccessTokenMaxAgeSeconds(): number {
  return oneHourInSeconds;
}

export function getRefreshTokenMaxAgeSeconds(): number {
  return refreshTokenLifetimeInSeconds;
}

export function getAccessTokenCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProductionEnvironment(),
    path: "/",
    maxAge: getAccessTokenMaxAgeSeconds()
  };
}

export function getRefreshTokenCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProductionEnvironment(),
    path: "/",
    maxAge: getRefreshTokenMaxAgeSeconds()
  };
}
