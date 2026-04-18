"use server";

import { loginSchema } from "@/features/auth/schemas/login-schema";
import { InvalidCredentialsError, loginWithEmailAndPasswordHash } from "@/features/auth/services/login-service";
import type { LoginActionResult } from "@/features/auth/types/auth";

function sanitizeNextPathname(value?: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/login")) {
    return "/";
  }

  return value;
}

export async function loginAction(input: {
  email: string;
  passwordHash: string;
  nextPathname?: string;
}): Promise<LoginActionResult> {
  const parsedInput = loginSchema.safeParse(input);
  console.log({ parsedInput });
  if (!parsedInput.success) {
    return {
      status: "error",
      message: "Revise seus dados e tente novamente.",
      fieldErrors: parsedInput.error.flatten().fieldErrors
    };
  }

  try {
    await loginWithEmailAndPasswordHash({
      email: parsedInput.data.email,
      passwordHash: parsedInput.data.passwordHash
    });

    return {
      status: "success",
      redirectTo: sanitizeNextPathname(parsedInput.data.nextPathname)
    };
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return {
        status: "error",
        message: error.message,
        fieldErrors: {
          email: [error.message],
          passwordHash: [error.message]
        }
      };
    }

    console.error("Failed to login.", error);

    return {
      status: "error",
      message: "Não foi possível iniciar a sessão agora."
    };
  }
}
