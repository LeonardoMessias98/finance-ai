import type { BudgetFieldName } from "@/features/budgets/types/budget";

type BudgetFieldErrors = Partial<Record<BudgetFieldName, string[]>>;

export class BudgetBusinessError extends Error {
  readonly fieldErrors?: BudgetFieldErrors;

  constructor(message: string, fieldErrors?: BudgetFieldErrors) {
    super(message);
    this.name = "BudgetBusinessError";
    this.fieldErrors = fieldErrors;
  }
}

export class DuplicateBudgetError extends BudgetBusinessError {
  constructor(message = "Já existe um orçamento para essa categoria nessa competência.") {
    super(message, {
      categoryId: [message],
      competencyMonth: [message]
    });
    this.name = "DuplicateBudgetError";
  }
}

export class InvalidBudgetCategoryError extends BudgetBusinessError {
  constructor(message = "Somente categorias de despesa podem receber orçamento.") {
    super(message, {
      categoryId: [message]
    });
    this.name = "InvalidBudgetCategoryError";
  }
}
