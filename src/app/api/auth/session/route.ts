import { NextResponse } from "next/server";

import { getCurrentAppSession } from "@/features/auth/services/get-current-session-service";
import { serializeAppSession } from "@/features/auth/utils/serialize-session";

export async function GET() {
  const session = await getCurrentAppSession();

  if (!session) {
    return NextResponse.json(
      {
        ok: false,
        message: "Sessão inválida ou expirada."
      },
      {
        status: 401
      }
    );
  }

  return NextResponse.json({
    ok: true,
    session: serializeAppSession(session)
  });
}
