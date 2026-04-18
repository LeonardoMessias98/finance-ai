import "server-only";

import { getOptionalAppSession } from "@/lib/auth/session";

export async function getCurrentAppSession() {
  return getOptionalAppSession();
}
