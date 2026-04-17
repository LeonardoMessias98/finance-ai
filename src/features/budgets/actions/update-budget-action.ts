"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";
import { budgetFormSchema, type BudgetFormValues } from "@/features/budgets/schemas/budget-schema";
import { BudgetBusinessError } from "@/features/budgets/services/budget-errors";
import { updateBudget } from "@/features/budgets/services/update-budget-service";
import type { BudgetActionResult } from "@/features/budgets/types/budget";

const updateBudgetActionSchema = z.object({
  budgetId: objectIdStringSchema
});

export async function updateBudgetAction(input: {
  budgetId: string;
  values: BudgetFormValues;
}): Promise<BudgetActionResult> {
  const parsedBudgetId = updateBudgetActionSchema.safeParse({
    budgetId: input.budgetId
  });

  if (!parsedBudgetId.success) {
    return {
      status: "error",
      message: "Orçamento inválido para edição."
    };
  }

  const parsedValues = budgetFormSchema.safeParse(input.values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos do orçamento e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    const updatedBudget = await updateBudget(parsedBudgetId.data.budgetId, parsedValues.data);

    if (!updatedBudget) {
      return {
        status: "error",
        message: "Orçamento não encontrado para edição."
      };
    }

    revalidatePath("/budgets");

    return {
      status: "success",
      message: "Orçamento atualizado com sucesso."
    };
  } catch (error) {
    if (error instanceof BudgetBusinessError) {
      return {
        status: "error",
        message: error.message,
        fieldErrors: error.fieldErrors
      };
    }

    console.error("Failed to update budget.", error);

    return {
      status: "error",
      message: "Não foi possível atualizar o orçamento agora."
    };
  }
}
