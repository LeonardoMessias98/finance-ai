import "server-only";

import { listCategories } from "@/features/categories/repositories/category-repository";
import { listTransactions } from "@/features/transactions/repositories/transaction-repository";
import { listBudgets } from "@/features/budgets/repositories/budget-repository";
import { calculateBudgetListItem } from "@/features/budgets/utils/budget-consumption";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

type ListBudgetsForManagementInput = {
  competencyMonth: string;
};

export async function listBudgetsForManagement(input: ListBudgetsForManagementInput) {
  const user = await requireAuthenticatedAppUser();

  const [budgets, categories, expenseTransactions] = await Promise.all([
    listBudgets({
      userId: user.id,
      competencyMonth: input.competencyMonth
    }),
    listCategories({
      userId: user.id,
      type: "expense"
    }),
    listTransactions({
      userId: user.id,
      competencyMonth: input.competencyMonth,
      type: "expense",
      status: "paid"
    })
  ]);

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const spentAmountByCategoryId = new Map<string, number>();

  for (const transaction of expenseTransactions) {
    if (!transaction.categoryId) {
      continue;
    }

    spentAmountByCategoryId.set(
      transaction.categoryId,
      (spentAmountByCategoryId.get(transaction.categoryId) ?? 0) + transaction.amount
    );
  }

  return budgets
    .map((budget) =>
      calculateBudgetListItem({
        budget,
        categoryName: categoryById.get(budget.categoryId)?.name ?? "Categoria removida",
        categoryIsActive: categoryById.get(budget.categoryId)?.isActive ?? false,
        spentAmount: spentAmountByCategoryId.get(budget.categoryId) ?? 0
      })
    )
    .sort((left, right) => {
      const statusPriority = {
        exceeded: 0,
        warning: 1,
        within_limit: 2
      } as const;

      if (statusPriority[left.consumptionStatus] !== statusPriority[right.consumptionStatus]) {
        return statusPriority[left.consumptionStatus] - statusPriority[right.consumptionStatus];
      }

      if (left.usedPercentage !== right.usedPercentage) {
        return right.usedPercentage - left.usedPercentage;
      }

      return left.categoryName.localeCompare(right.categoryName, "pt-BR");
    });
}
