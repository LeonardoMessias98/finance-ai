"use server";

import { revalidatePath } from "next/cache";

import { budgetFormSchema, type BudgetFormValues } from "@/features/budgets/schemas/budget-schema";
import { createBudget } from "@/features/budgets/services/create-budget-service";
import { BudgetBusinessError } from "@/features/budgets/services/budget-errors";
import type { BudgetActionResult } from "@/features/budgets/types/budget";

export async function createBudgetAction(values: BudgetFormValues): Promise<BudgetActionResult> {
  const parsedValues = budgetFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos do orçamento e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    await createBudget(parsedValues.data);
    revalidatePath("/budgets");

    return {
      status: "success",
      message: "Orçamento criado com sucesso."
    };
  } catch (error) {
    if (error instanceof BudgetBusinessError) {
      return {
        status: "error",
        message: error.message,
        fieldErrors: error.fieldErrors
      };
    }

    console.error("Failed to create budget.", error);

    return {
      status: "error",
      message: "Não foi possível criar o orçamento agora."
    };
  }
}
