export type Budget = {
  id: string;
  competencyMonth: string;
  categoryId: string;
  limitAmount: number;
  alertThresholds?: number[];
};

export type BudgetFieldName = "competencyMonth" | "categoryId" | "limitAmount";

export type CreateBudgetInput = {
  competencyMonth: string;
  categoryId: string;
  limitAmount: number;
  alertThresholds?: number[];
};

export type UpdateBudgetInput = CreateBudgetInput & {
  id: string;
};

export type BudgetFilters = {
  competencyMonth?: string;
  categoryId?: string;
};

export type BudgetConsumptionStatus = "within_limit" | "warning" | "exceeded";

export type BudgetListItem = {
  id: string;
  competencyMonth: string;
  categoryId: string;
  categoryName: string;
  categoryIsActive: boolean;
  limitAmount: number;
  spentAmount: number;
  remainingAmount: number;
  usedPercentage: number;
  progressPercentage: number;
  consumptionStatus: BudgetConsumptionStatus;
  alertThresholds: number[];
};

export type BudgetActionResult =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<BudgetFieldName, string[]>>;
    };
