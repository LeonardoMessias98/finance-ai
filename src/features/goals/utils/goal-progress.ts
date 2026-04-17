import type { Goal, GoalListItem } from "@/features/goals/types/goal";

export function calculateGoalListItem(goal: Goal): GoalListItem {
  const progressPercentage = Number(((goal.currentAmount / goal.targetAmount) * 100).toFixed(1));

  return {
    ...goal,
    progressPercentage,
    cappedProgressPercentage: Math.min(progressPercentage, 100),
    remainingAmount: Math.max(goal.targetAmount - goal.currentAmount, 0)
  };
}
