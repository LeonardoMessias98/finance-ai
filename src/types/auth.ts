export type AuthenticatedAppUser = {
  id: string;
  email: string | null;
  name: string | null;
};

export type AppSession = {
  user: AuthenticatedAppUser;
};

export type UserScopedEntity = {
  userId: string;
};
