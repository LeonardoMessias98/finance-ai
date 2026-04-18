import "server-only";

import type { ParsedGoalFormValues } from "@/features/goals/schemas/goal-schema";
import { updateGoal as updateGoalRecord } from "@/features/goals/repositories/goal-repository";
import { normalizeGoalFormValues } from "@/features/goals/utils/normalize-goal-form-values";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function updateGoal(goalId: string, values: ParsedGoalFormValues) {
  const user = await requireAuthenticatedAppUser();

  return updateGoalRecord({
    id: goalId,
    userId: user.id,
    ...normalizeGoalFormValues(values)
  });
}
