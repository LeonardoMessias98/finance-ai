import { NextResponse } from "next/server";

import { refreshCurrentSession } from "@/lib/auth/session-cookies";
import { serializeAppSession } from "@/features/auth/utils/serialize-session";

export async function POST() {
  const refreshed = await refreshCurrentSession();

  if (!refreshed) {
    return NextResponse.json(
      {
        ok: false
      },
      {
        status: 401
      }
    );
  }

  return NextResponse.json({
    ok: true,
    session: serializeAppSession(refreshed)
  });
}
