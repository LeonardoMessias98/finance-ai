import "server-only";

import { revokeCurrentSession } from "@/lib/auth/session-cookies";

export async function logoutCurrentSession(): Promise<void> {
  await revokeCurrentSession();
}
