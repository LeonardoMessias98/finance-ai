import type { SerializedAppSession } from "@/features/auth/types/auth";
import type { AppSession } from "@/types/auth";

export function serializeAppSession(session: AppSession): SerializedAppSession {
  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      birthDate: session.user.birthDate.toISOString(),
      sessionId: session.user.sessionId
    },
    accessTokenExpiresAt: session.accessTokenExpiresAt.toISOString()
  };
}
