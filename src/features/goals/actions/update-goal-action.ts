"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";
import { goalFormSchema, type GoalFormValues } from "@/features/goals/schemas/goal-schema";
import { updateGoal } from "@/features/goals/services/update-goal-service";
import type { GoalActionResult } from "@/features/goals/types/goal";

const updateGoalActionSchema = z.object({
  goalId: objectIdStringSchema
});

export async function updateGoalAction(input: {
  goalId: string;
  values: GoalFormValues;
}): Promise<GoalActionResult> {
  const parsedGoalId = updateGoalActionSchema.safeParse({
    goalId: input.goalId
  });

  if (!parsedGoalId.success) {
    return {
      status: "error",
      message: "Meta inválida para edição."
    };
  }

  const parsedValues = goalFormSchema.safeParse(input.values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos da meta e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    const updatedGoal = await updateGoal(parsedGoalId.data.goalId, parsedValues.data);

    if (!updatedGoal) {
      return {
        status: "error",
        message: "Meta não encontrada para edição."
      };
    }

    revalidatePath("/goals");

    return {
      status: "success",
      message: "Meta atualizada com sucesso."
    };
  } catch (error) {
    console.error("Failed to update goal.", error);

    return {
      status: "error",
      message: "Não foi possível atualizar a meta agora."
    };
  }
}
