"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";
import { deleteTransaction } from "@/features/transactions/services/delete-transaction-service";
import type { TransactionActionResult } from "@/features/transactions/types/transaction";

const deleteTransactionActionSchema = z.object({
  transactionId: objectIdStringSchema
});

export async function deleteTransactionAction(input: {
  transactionId: string;
}): Promise<TransactionActionResult> {
  const parsedInput = deleteTransactionActionSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      status: "error",
      message: "Transação inválida para exclusão."
    };
  }

  try {
    const deletionResult = await deleteTransaction(parsedInput.data.transactionId);

    if (!deletionResult) {
      return {
        status: "error",
        message: "Transação não encontrada para exclusão."
      };
    }

    revalidatePath("/transactions");
    revalidatePath("/");
    revalidatePath("/budgets");

    return {
      status: "success",
      message:
        deletionResult.deletedCount > 1
          ? "Série parcelada excluída com sucesso."
          : "Transação excluída com sucesso."
    };
  } catch (error) {
    console.error("Failed to delete transaction.", error);

    return {
      status: "error",
      message: "Não foi possível excluir a transação agora."
    };
  }
}
