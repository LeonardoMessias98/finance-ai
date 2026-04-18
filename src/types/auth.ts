export type AuthenticatedAppUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  sessionId: string;
};

export type AppSession = {
  user: AuthenticatedAppUser;
  accessTokenExpiresAt: Date;
};

export type UserScopedEntity = {
  userId: string;
};

export type AccessTokenPayload = {
  sub: string;
  email: string;
  sessionId: string;
  type: "access";
  exp: number;
  iat: number;
};
