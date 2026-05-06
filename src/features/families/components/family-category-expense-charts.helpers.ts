import type { FamilyCategoryChartData } from "@/features/families/components/family-category-expense-charts.types";
import type { FamilyMemberFinancialSummary } from "@/features/families/types/family-financial-summary";

export function buildFamilyMemberCategoryChartData(member: FamilyMemberFinancialSummary): FamilyCategoryChartData {
  return {
    debitChartData: member.expenseCategoryBreakdown.debit.expensesByCategory.map((item) => ({
      categoryName: item.categoryName,
      amount: item.amount,
      percentage: item.percentage
    })),
    creditChartData: member.expenseCategoryBreakdown.credit.expensesByCategory.map((item) => ({
      categoryName: item.categoryName,
      amount: item.amount,
      percentage: item.percentage
    }))
  };
}
