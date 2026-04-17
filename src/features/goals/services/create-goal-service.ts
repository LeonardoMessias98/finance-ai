import "server-only";

import type { ParsedGoalFormValues } from "@/features/goals/schemas/goal-schema";
import { createGoal as createGoalRecord } from "@/features/goals/repositories/goal-repository";
import { normalizeGoalFormValues } from "@/features/goals/utils/normalize-goal-form-values";

export async function createGoal(values: ParsedGoalFormValues) {
  return createGoalRecord(normalizeGoalFormValues(values));
}
