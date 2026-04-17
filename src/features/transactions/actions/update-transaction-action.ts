"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";
import { transactionFormSchema, type TransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import { TransactionBusinessError } from "@/features/transactions/services/transaction-errors";
import { updateTransaction } from "@/features/transactions/services/update-transaction-service";
import type { TransactionActionResult } from "@/features/transactions/types/transaction";

const updateTransactionActionSchema = z.object({
  transactionId: objectIdStringSchema
});

export async function updateTransactionAction(input: {
  transactionId: string;
  values: TransactionFormValues;
}): Promise<TransactionActionResult> {
  const parsedTransactionId = updateTransactionActionSchema.safeParse({
    transactionId: input.transactionId
  });

  if (!parsedTransactionId.success) {
    return {
      status: "error",
      message: "Transação inválida para edição."
    };
  }

  const parsedValues = transactionFormSchema.safeParse(input.values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos da transação e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    const updatedTransaction = await updateTransaction(parsedTransactionId.data.transactionId, parsedValues.data);

    if (!updatedTransaction) {
      return {
        status: "error",
        message: "Transação não encontrada para edição."
      };
    }

    revalidatePath("/transactions");
    revalidatePath("/");
    revalidatePath("/budgets");

    return {
      status: "success",
      message: "Transação atualizada com sucesso."
    };
  } catch (error) {
    if (error instanceof TransactionBusinessError) {
      return {
        status: "error",
        message: error.message,
        fieldErrors: error.fieldErrors
      };
    }

    console.error("Failed to update transaction.", error);

    return {
      status: "error",
      message: "Não foi possível atualizar a transação agora."
    };
  }
}
