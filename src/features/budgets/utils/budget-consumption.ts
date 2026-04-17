import type { Budget, BudgetConsumptionStatus, BudgetListItem } from "@/features/budgets/types/budget";

type CalculateBudgetConsumptionInput = {
  budget: Budget;
  categoryName: string;
  categoryIsActive: boolean;
  spentAmount: number;
};

function getConsumptionStatus(usedPercentage: number, alertThresholds: number[]): BudgetConsumptionStatus {
  if (usedPercentage >= 100 || alertThresholds.includes(100) && usedPercentage >= 100) {
    return "exceeded";
  }

  const warningThreshold = [...alertThresholds]
    .filter((threshold) => threshold < 100)
    .sort((left, right) => right - left)[0];

  if (warningThreshold && usedPercentage >= warningThreshold) {
    return "warning";
  }

  return "within_limit";
}

export function calculateBudgetListItem(input: CalculateBudgetConsumptionInput): BudgetListItem {
  const alertThresholds =
    input.budget.alertThresholds && input.budget.alertThresholds.length > 0
      ? [...input.budget.alertThresholds].sort((left, right) => left - right)
      : [80, 100];
  const usedPercentage = Number(((input.spentAmount / input.budget.limitAmount) * 100).toFixed(1));
  const progressPercentage = Math.min(usedPercentage, 100);
  const remainingAmount = input.budget.limitAmount - input.spentAmount;

  return {
    id: input.budget.id,
    competencyMonth: input.budget.competencyMonth,
    categoryId: input.budget.categoryId,
    categoryName: input.categoryName,
    categoryIsActive: input.categoryIsActive,
    limitAmount: input.budget.limitAmount,
    spentAmount: input.spentAmount,
    remainingAmount,
    usedPercentage,
    progressPercentage,
    consumptionStatus: getConsumptionStatus(usedPercentage, alertThresholds),
    alertThresholds
  };
}

export function getBudgetConsumptionStatusLabel(status: BudgetConsumptionStatus): string {
  if (status === "exceeded") {
    return "Ultrapassado";
  }

  if (status === "warning") {
    return "Atenção";
  }

  return "Dentro do limite";
}
