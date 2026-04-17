"use server";

import { revalidatePath } from "next/cache";

import { toggleAccountStatusSchema } from "@/features/accounts/schemas/account-schema";
import { toggleAccountStatus } from "@/features/accounts/services/toggle-account-status-service";
import type { AccountActionResult } from "@/features/accounts/types/account";

export async function toggleAccountStatusAction(input: {
  accountId: string;
  isActive: boolean;
}): Promise<AccountActionResult> {
  const parsedInput = toggleAccountStatusSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      status: "error",
      message: "Não foi possível alterar o status da conta."
    };
  }

  try {
    const updatedAccount = await toggleAccountStatus(parsedInput.data.accountId, parsedInput.data.isActive);

    if (!updatedAccount) {
      return {
        status: "error",
        message: "Conta não encontrada para atualização."
      };
    }

    revalidatePath("/accounts");

    return {
      status: "success",
      message: parsedInput.data.isActive ? "Conta ativada com sucesso." : "Conta desativada com sucesso."
    };
  } catch (error) {
    console.error("Failed to toggle account status.", error);

    return {
      status: "error",
      message: "Não foi possível alterar o status da conta agora."
    };
  }
}
