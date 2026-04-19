import type { GoalFormValues } from "@/features/goals/schemas/goal-schema";
import type { Goal } from "@/features/goals/types/goal";

function formatDateForInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getGoalFormDefaultValues(goal?: Goal | null): GoalFormValues {
  return {
    name: goal?.name ?? "",
    targetAmount: goal ? goal.targetAmount / 100 : 0,
    currentAmount: goal ? goal.currentAmount / 100 : 0,
    targetDate: goal?.targetDate ? formatDateForInput(goal.targetDate) : ""
  };
}
