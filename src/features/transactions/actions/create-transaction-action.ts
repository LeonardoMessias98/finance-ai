"use server";

import { revalidatePath } from "next/cache";

import { transactionFormSchema, type TransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import { createTransaction } from "@/features/transactions/services/create-transaction-service";
import { TransactionBusinessError } from "@/features/transactions/services/transaction-errors";
import type { TransactionActionResult } from "@/features/transactions/types/transaction";

export async function createTransactionAction(values: TransactionFormValues): Promise<TransactionActionResult> {
  const parsedValues = transactionFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos da transação e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    const createdTransactions = await createTransaction(parsedValues.data);
    revalidatePath("/transactions");
    revalidatePath("/");
    revalidatePath("/budgets");

    return {
      status: "success",
      message:
        createdTransactions.length > 1
          ? `${createdTransactions.length} parcelas criadas com sucesso.`
          : "Transação criada com sucesso."
    };
  } catch (error) {
    if (error instanceof TransactionBusinessError) {
      return {
        status: "error",
        message: error.message,
        fieldErrors: error.fieldErrors
      };
    }

    console.error("Failed to create transaction.", error);

    return {
      status: "error",
      message: "Não foi possível criar a transação agora."
    };
  }
}
