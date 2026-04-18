import type { ParsedGoalFormValues } from "@/features/goals/schemas/goal-schema";
import type { CreateGoalInput } from "@/features/goals/types/goal";

function parseDateInput(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function normalizeGoalFormValues(values: ParsedGoalFormValues): Omit<CreateGoalInput, "userId"> {
  return {
    name: values.name.trim(),
    targetAmount: Math.round(values.targetAmount * 100),
    currentAmount: Math.round(values.currentAmount * 100),
    targetDate: parseDateInput(values.targetDate)
  };
}
