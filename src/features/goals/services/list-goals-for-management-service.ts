import "server-only";

import { listGoals } from "@/features/goals/repositories/goal-repository";
import { calculateGoalListItem } from "@/features/goals/utils/goal-progress";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function listGoalsForManagement() {
  const user = await requireAuthenticatedAppUser();
  const goals = await listGoals({
    userId: user.id
  });

  return goals.map(calculateGoalListItem);
}
