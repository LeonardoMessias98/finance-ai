import { describe, expect, it } from "vitest";

import { buildFamilyMemberCategoryChartData } from "@/features/families/components/family-category-expense-charts.helpers";
import type { FamilyMemberFinancialSummary } from "@/features/families/types/family-financial-summary";

const member: FamilyMemberFinancialSummary = {
  userId: "user-1",
  displayName: "Ana",
  role: "owner",
  canView: true,
  totalCurrentBalance: 0,
  monthlyIncome: 0,
  monthlyDebitIncome: 0,
  monthlyExpense: 0,
  monthlyDebitExpense: 0,
  monthlyCreditExpense: 0,
  monthlyResult: 0,
  latestTransactions: [],
  expenseCategoryBreakdown: {
    memberId: "user-1",
    memberName: "Ana",
    debit: {
      totalExpenses: 100_000,
      expensesByCategory: [
        {
          categoryId: "market",
          categoryName: "Mercado",
          amount: 70_000,
          percentage: 0.7
        }
      ]
    },
    credit: {
      totalExpenses: 50_000,
      expensesByCategory: [
        {
          categoryId: "leisure",
          categoryName: "Lazer",
          amount: 50_000,
          percentage: 1
        }
      ]
    }
  }
};

describe("buildFamilyMemberCategoryChartData", () => {
  it("keeps debit and credit category chart data separated", () => {
    expect(buildFamilyMemberCategoryChartData(member)).toEqual({
      debitChartData: [
        {
          categoryName: "Mercado",
          amount: 70_000,
          percentage: 0.7
        }
      ],
      creditChartData: [
        {
          categoryName: "Lazer",
          amount: 50_000,
          percentage: 1
        }
      ]
    });
  });
});
