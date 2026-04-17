import "server-only";

import { listGoals } from "@/features/goals/repositories/goal-repository";
import { calculateGoalListItem } from "@/features/goals/utils/goal-progress";

export async function listGoalsForManagement() {
  const goals = await listGoals();

  return goals.map(calculateGoalListItem);
}
