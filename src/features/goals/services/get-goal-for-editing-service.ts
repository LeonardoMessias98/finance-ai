import "server-only";

import { findGoalById } from "@/features/goals/repositories/goal-repository";

export async function getGoalForEditing(goalId: string) {
  return findGoalById(goalId);
}
