"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AccountHasTransactionsError } from "@/features/accounts/services/account-errors";
import { deleteAccount } from "@/features/accounts/services/delete-account-service";
import type { AccountActionResult } from "@/features/accounts/types/account";
import { objectIdStringSchema } from "@/lib/db/object-id";

const deleteAccountActionSchema = z.object({
  accountId: objectIdStringSchema
});

export async function deleteAccountAction(input: { accountId: string }): Promise<AccountActionResult> {
  const parsedInput = deleteAccountActionSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      status: "error",
      message: "Conta inválida para exclusão."
    };
  }

  try {
    const deletedAccount = await deleteAccount(parsedInput.data.accountId);

    if (!deletedAccount) {
      return {
        status: "error",
        message: "Conta não encontrada para exclusão."
      };
    }

    revalidatePath("/accounts");

    return {
      status: "success",
      message: "Conta excluída com sucesso."
    };
  } catch (error) {
    if (error instanceof AccountHasTransactionsError) {
      return {
        status: "error",
        message: error.message
      };
    }

    console.error("Failed to delete account.", error);

    return {
      status: "error",
      message: "Não foi possível excluir a conta agora."
    };
  }
}
