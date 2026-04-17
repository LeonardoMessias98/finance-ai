"use server";

import { revalidatePath } from "next/cache";

import { goalFormSchema, type GoalFormValues } from "@/features/goals/schemas/goal-schema";
import { createGoal } from "@/features/goals/services/create-goal-service";
import type { GoalActionResult } from "@/features/goals/types/goal";

export async function createGoalAction(values: GoalFormValues): Promise<GoalActionResult> {
  const parsedValues = goalFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      status: "error",
      message: "Revise os campos da meta e tente novamente.",
      fieldErrors: parsedValues.error.flatten().fieldErrors
    };
  }

  try {
    await createGoal(parsedValues.data);
    revalidatePath("/goals");

    return {
      status: "success",
      message: "Meta criada com sucesso."
    };
  } catch (error) {
    console.error("Failed to create goal.", error);

    return {
      status: "error",
      message: "Não foi possível criar a meta agora."
    };
  }
}
