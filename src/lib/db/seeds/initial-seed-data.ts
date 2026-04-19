import type { CreateAccountInput } from "@/features/accounts/types/account";
import type { CreateBudgetInput } from "@/features/budgets/types/budget";
import type { CreateCategoryInput } from "@/features/categories/types/category";
import type { CreateGoalInput } from "@/features/goals/types/goal";
import type { CreateTransactionInput } from "@/features/transactions/types/transaction";

export const initialAccountSeedData = [
  {
    name: "Conta corrente",
    type: "checking",
    initialBalance: 250_000,
    isActive: true,
    color: "#0f766e",
    icon: "wallet"
  },
  {
    name: "Reserva",
    type: "savings",
    initialBalance: 120_000,
    isActive: true,
    color: "#1d4ed8",
    icon: "piggy-bank"
  },
  {
    name: "Carteira",
    type: "cash",
    initialBalance: 15_000,
    isActive: true,
    color: "#b45309",
    icon: "banknote"
  },
  {
    name: "Cartão principal",
    type: "credit_card",
    initialBalance: 0,
    isActive: true,
    color: "#7c3aed",
    icon: "credit-card"
  },
  {
    name: "Investimentos",
    type: "investment",
    initialBalance: 75_000,
    isActive: true,
    color: "#166534",
    icon: "chart-column"
  }
] as const satisfies readonly Omit<CreateAccountInput, "userId">[];

export const initialCategorySeedData = [
  {
    name: "salário",
    type: "income",
    isActive: true,
    color: "#15803d",
    icon: "badge-dollar-sign"
  },
  {
    name: "freela",
    type: "income",
    isActive: true,
    color: "#0284c7",
    icon: "briefcase-business"
  },
  {
    name: "investimentos",
    type: "income",
    isActive: true,
    color: "#0f766e",
    icon: "trending-up"
  },
  {
    name: "presentes",
    type: "income",
    isActive: true,
    color: "#9333ea",
    icon: "gift"
  },
  {
    name: "alimentação",
    type: "expense",
    isActive: true,
    color: "#ea580c",
    icon: "utensils-crossed"
  },
  {
    name: "transporte",
    type: "expense",
    isActive: true,
    color: "#2563eb",
    icon: "bus"
  },
  {
    name: "moradia",
    type: "expense",
    isActive: true,
    color: "#a16207",
    icon: "house"
  },
  {
    name: "saúde",
    type: "expense",
    isActive: true,
    color: "#dc2626",
    icon: "heart-pulse"
  },
  {
    name: "lazer",
    type: "expense",
    isActive: true,
    color: "#7c3aed",
    icon: "party-popper"
  },
  {
    name: "mercado",
    type: "expense",
    isActive: true,
    color: "#16a34a",
    icon: "shopping-cart"
  },
  {
    name: "assinaturas",
    type: "expense",
    isActive: true,
    color: "#475569",
    icon: "repeat"
  },
  {
    name: "estudos",
    type: "expense",
    isActive: true,
    color: "#7e22ce",
    icon: "graduation-cap"
  }
] as const satisfies readonly Omit<CreateCategoryInput, "userId">[];

export type OptionalSampleSeedContext = {
  checkingAccountId: string;
  salaryCategoryId: string;
  marketCategoryId: string;
  competencyMonth: string;
};

export type OptionalSampleSeedData = {
  transactions: Omit<CreateTransactionInput, "userId">[];
  budgets: Omit<CreateBudgetInput, "userId">[];
  goals: Omit<CreateGoalInput, "userId">[];
};

function buildUtcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function buildMonthDate(competencyMonth: string, day: number): Date {
  const [year, month] = competencyMonth.split("-").map(Number);

  return buildUtcDate(year, month, day);
}

function buildGoalTargetDate(competencyMonth: string): Date {
  const [year] = competencyMonth.split("-").map(Number);

  return buildUtcDate(year + 1, 12, 31);
}

export function buildOptionalSampleSeedData(context: OptionalSampleSeedContext): OptionalSampleSeedData {
  return {
    transactions: [
      {
        description: "Salário base de exemplo",
        amount: 450_000,
        type: "income",
        date: buildMonthDate(context.competencyMonth, 5),
        competencyMonth: context.competencyMonth,
        categoryId: context.salaryCategoryId,
        accountId: context.checkingAccountId,
        status: "received",
        isRecurring: false
      },
      {
        description: "Mercado de exemplo",
        amount: 68_000,
        type: "expense",
        date: buildMonthDate(context.competencyMonth, 12),
        competencyMonth: context.competencyMonth,
        categoryId: context.marketCategoryId,
        accountId: context.checkingAccountId,
        status: "paid",
        isRecurring: false
      }
    ],
    budgets: [
      {
        competencyMonth: context.competencyMonth,
        categoryId: context.marketCategoryId,
        limitAmount: 120_000,
        alertThresholds: [80, 100]
      }
    ],
    goals: [
      {
        name: "Reserva de emergência",
        targetAmount: 1_000_000,
        currentAmount: 350_000,
        targetDate: buildGoalTargetDate(context.competencyMonth)
      }
    ]
  };
}
