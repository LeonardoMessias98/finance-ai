/**
 * Utilitários compartilhados para criação de usuários
 */

import { createUserSchema } from "@/features/auth/schemas/user-schema";
import { UserModel } from "@/lib/db/models/user-model";

export interface UserCreationInput {
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD format
  email: string;
  passwordHash: string;
  lastLoginIp?: string;
}

export interface CreatedUserResult {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Parse birth date from YYYY-MM-DD format to Date
 */
export function parseBirthDateInput(value: string): Date {
  try {
    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) {
      throw new Error("Formato inválido");
    }

    return new Date(Date.UTC(year, month - 1, day, 12));
  } catch (error) {
    throw new Error(
      `Data de nascimento inválida: ${value}. Use formato YYYY-MM-DD (ex: 1998-10-16)`
    );
  }
}

/**
 * Create a new user in the database
 */
export async function createUser(
  input: UserCreationInput,
  options?: { skipEmailCheck?: boolean }
): Promise<CreatedUserResult> {
  const parsedBirthDate = parseBirthDateInput(input.birthDate);

  // Check if user already exists (unless skipped)
  if (!options?.skipEmailCheck) {
    const existingUser = await UserModel.findOne({
      email: input.email
    })
      .collation({
        locale: "en",
        strength: 2
      })
      .exec();

    if (existingUser) {
      throw new Error(
        `Usuário com email "${input.email}" já existe (ID: ${existingUser._id})`
      );
    }
  }

  // Validate using Zod schema
  const payload = createUserSchema.parse({
    firstName: input.firstName,
    lastName: input.lastName,
    birthDate: parsedBirthDate,
    email: input.email,
    passwordHash: input.passwordHash,
    lastLoginIp: input.lastLoginIp || "script"
  });

  const createdUser = await UserModel.create(payload);

  return {
    id: createdUser._id.toString(),
    email: createdUser.email,
    firstName: createdUser.firstName,
    lastName: createdUser.lastName
  };
}

/**
 * Read user creation input from environment variables
 */
export function readUserInputFromEnv(): UserCreationInput {
  const prefix = "SEED_USER";
  const firstName = process.env[`${prefix}_FIRST_NAME`]?.trim();
  const lastName = process.env[`${prefix}_LAST_NAME`]?.trim();
  const birthDate = process.env[`${prefix}_BIRTH_DATE`]?.trim();
  const email = process.env[`${prefix}_EMAIL`]?.trim();
  const passwordHash = process.env[`${prefix}_PASSWORD_SHA256`]?.trim();

  if (!firstName || !lastName || !birthDate || !email || !passwordHash) {
    const missing = [];
    if (!firstName) missing.push(`${prefix}_FIRST_NAME`);
    if (!lastName) missing.push(`${prefix}_LAST_NAME`);
    if (!birthDate) missing.push(`${prefix}_BIRTH_DATE`);
    if (!email) missing.push(`${prefix}_EMAIL`);
    if (!passwordHash) missing.push(`${prefix}_PASSWORD_SHA256`);

    throw new Error(
      `Variáveis de ambiente ausentes:\n  - ${missing.join("\n  - ")}`
    );
  }

  return {
    firstName,
    lastName,
    birthDate,
    email,
    passwordHash
  };
}
