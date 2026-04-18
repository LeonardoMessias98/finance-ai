export type User = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  passwordHash: string;
  lastLoginIp?: string;
  lastLoginLocation?: string;
  activeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  passwordHash: string;
  lastLoginIp?: string;
  lastLoginLocation?: string;
  activeSessionId?: string;
};

export type UpdateUserActiveSessionInput = {
  userId: string;
  sessionId?: string;
  lastLoginIp: string;
  lastLoginLocation?: string;
};

export type RefreshToken = {
  id: string;
  userId: string;
  sessionId: string;
  tokenHash: string;
  ip: string;
  location?: string;
  userAgent: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateRefreshTokenInput = {
  userId: string;
  sessionId: string;
  tokenHash: string;
  ip: string;
  location?: string;
  userAgent: string;
  expiresAt: Date;
};
