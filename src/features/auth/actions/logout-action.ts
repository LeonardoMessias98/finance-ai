"use server";

import { logoutCurrentSession } from "@/features/auth/services/logout-service";
import type { LogoutActionResult } from "@/features/auth/types/auth";

export async function logoutAction(): Promise<LogoutActionResult> {
  try {
    await logoutCurrentSession();

    return {
      status: "success",
      redirectTo: "/login"
    };
  } catch (error) {
    console.error("Failed to logout.", error);

    return {
      status: "error",
      message: "Não foi possível encerrar a sessão agora."
    };
  }
}
