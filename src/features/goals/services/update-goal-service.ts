import "server-only";

import type { ParsedGoalFormValues } from "@/features/goals/schemas/goal-schema";
import { updateGoal as updateGoalRecord } from "@/features/goals/repositories/goal-repository";
import { normalizeGoalFormValues } from "@/features/goals/utils/normalize-goal-form-values";

export async function updateGoal(goalId: string, values: ParsedGoalFormValues) {
  return updateGoalRecord({
    id: goalId,
    ...normalizeGoalFormValues(values)
  });
}
