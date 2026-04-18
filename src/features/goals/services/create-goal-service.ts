import "server-only";

import { Types } from "mongoose";

import type { ParsedGoalFormValues } from "@/features/goals/schemas/goal-schema";
import { createGoal as createGoalRecord } from "@/features/goals/repositories/goal-repository";
import { normalizeGoalFormValues } from "@/features/goals/utils/normalize-goal-form-values";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function createGoal(values: ParsedGoalFormValues) {
  const user = await requireAuthenticatedAppUser();

  // Ensure userId is a valid ObjectId
  if (!Types.ObjectId.isValid(user.id)) {
    throw new Error(`Invalid user ID: ${user.id}`);
  }

  return createGoalRecord({
    userId: user.id,
    ...normalizeGoalFormValues(values)
  });
}
