"use server";

import { revalidatePath } from "next/cache";

import { accountFormSchema, type AccountFormValues } from "@/features/accounts/schemas/account-schema";
import { createAccount } from "@/features/accounts/services/create-account-service";
import type { AccountActionResult } from "@/features/accounts/types/account";

export async function createAccountAction(values: AccountFormValues): Promise<AccountActionResult> {
  const parsedValues = accountFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos da conta e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    await createAccount(parsedValues.data);
    revalidatePath("/accounts");

    return {
      status: "success",
      message: "Conta criada com sucesso."
    };
  } catch (error) {
    console.error("Failed to create account.", error);

    return {
      status: "error",
      message: "Não foi possível criar a conta agora."
    };
  }
}
