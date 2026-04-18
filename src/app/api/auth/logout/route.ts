import { NextResponse } from "next/server";

import { logoutCurrentSession } from "@/features/auth/services/logout-service";

export async function POST() {
  try {
    await logoutCurrentSession();

    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    console.error("Failed to logout via route.", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Não foi possível encerrar a sessão agora."
      },
      {
        status: 500
      }
    );
  }
}
