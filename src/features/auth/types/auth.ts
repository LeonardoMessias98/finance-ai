export type LoginActionResult =
  | {
      status: "success";
      redirectTo: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<"email" | "password" | "passwordHash", string[]>>;
    };

export type RefreshSessionResult =
  | {
      status: "success";
    }
  | {
      status: "error";
      message: string;
    };

export type LogoutActionResult =
  | {
      status: "success";
      redirectTo: string;
    }
  | {
      status: "error";
      message: string;
    };

export type SerializedSessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  sessionId: string;
};

export type SerializedAppSession = {
  user: SerializedSessionUser;
  accessTokenExpiresAt: string;
};

export type AuthRouteSuccessResult = {
  ok: true;
  session?: SerializedAppSession;
};

export type AuthRouteErrorResult = {
  ok: false;
  message: string;
};
