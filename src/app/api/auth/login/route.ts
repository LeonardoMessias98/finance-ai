import { NextResponse } from "next/server";

import { loginSchema } from "@/features/auth/schemas/login-schema";
import { InvalidCredentialsError, loginWithEmailAndPasswordHash } from "@/features/auth/services/login-service";
import { serializeAppSession } from "@/features/auth/utils/serialize-session";

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Corpo de requisição inválido."
      },
      {
        status: 400
      }
    );
  }

  const parsedInput = loginSchema.safeParse(requestBody);

  if (!parsedInput.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Revise seus dados e tente novamente."
      },
      {
        status: 400
      }
    );
  }

  try {
    const session = await loginWithEmailAndPasswordHash({
      email: parsedInput.data.email,
      passwordHash: parsedInput.data.passwordHash
    });

    return NextResponse.json({
      ok: true,
      session: serializeAppSession(session)
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 401
        }
      );
    }

    console.error("Failed to login via route.", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Não foi possível iniciar a sessão agora."
      },
      {
        status: 500
      }
    );
  }
}
