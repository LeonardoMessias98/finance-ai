import "server-only";

import { findGoalById } from "@/features/goals/repositories/goal-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function getGoalForEditing(goalId: string) {
  const user = await requireAuthenticatedAppUser();

  return findGoalById(goalId, user.id);
}
