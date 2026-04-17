"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";
import { accountFormSchema, type AccountFormValues } from "@/features/accounts/schemas/account-schema";
import { updateAccount } from "@/features/accounts/services/update-account-service";
import type { AccountActionResult } from "@/features/accounts/types/account";

const updateAccountActionSchema = z.object({
  accountId: objectIdStringSchema
});

export async function updateAccountAction(input: {
  accountId: string;
  values: AccountFormValues;
}): Promise<AccountActionResult> {
  const parsedAccountId = updateAccountActionSchema.safeParse({
    accountId: input.accountId
  });

  if (!parsedAccountId.success) {
    return {
      status: "error",
      message: "Conta inválida para edição."
    };
  }

  const parsedValues = accountFormSchema.safeParse(input.values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos da conta e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    const updatedAccount = await updateAccount(parsedAccountId.data.accountId, parsedValues.data);

    if (!updatedAccount) {
      return {
        status: "error",
        message: "Conta não encontrada para edição."
      };
    }

    revalidatePath("/accounts");

    return {
      status: "success",
      message: "Conta atualizada com sucesso."
    };
  } catch (error) {
    console.error("Failed to update account.", error);

    return {
      status: "error",
      message: "Não foi possível atualizar a conta agora."
    };
  }
}
