import type { DashboardCategoryTotal } from "@/features/dashboard/types/dashboard-financial-summary";
import type {
  DashboardAnalytics,
  DashboardExpenseCategoryChartItem,
  DashboardForecastSeriesPoint,
  DashboardHistoricalSeriesPoint
} from "@/features/dashboard/types/dashboard-analytics";
import type { Transaction } from "@/features/transactions/types/transaction";
import { shiftCompetencyMonth } from "@/lib/dates/competency-month";

const historicalMonthWindow = 6;
const forecastMonthWindow = 3;
const forecastAverageWindow = 3;
const maxVisibleExpenseCategories = 5;

const shortCompetencyMonthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC"
});

function formatShortCompetencyMonth(competencyMonth: string): string {
  const [year, month] = competencyMonth.split("-").map(Number);
  const formattedValue = shortCompetencyMonthFormatter
    .format(new Date(Date.UTC(year, month - 1, 1, 12)))
    .replace(".", "");

  return formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);
}

function listHistoricalCompetencyMonths(competencyMonth: string): string[] {
  return Array.from({ length: historicalMonthWindow }, (_, index) =>
    shiftCompetencyMonth(competencyMonth, index - historicalMonthWindow + 1)
  );
}

function buildHistoricalSeries(
  allAppliedTransactions: Transaction[],
  competencyMonth: string
): DashboardHistoricalSeriesPoint[] {
  const months = listHistoricalCompetencyMonths(competencyMonth);
  const totalsByMonth = new Map(
    months.map((month) => [
      month,
      {
        income: 0,
        expense: 0
      }
    ])
  );

  for (const transaction of allAppliedTransactions) {
    const monthlyTotals = totalsByMonth.get(transaction.competencyMonth);

    if (!monthlyTotals) {
      continue;
    }

    if (transaction.type === "income") {
      monthlyTotals.income += transaction.amount;
      continue;
    }

    monthlyTotals.expense += transaction.amount;
  }

  return months.map((month) => {
    const monthlyTotals = totalsByMonth.get(month);
    const income = monthlyTotals?.income ?? 0;
    const expense = monthlyTotals?.expense ?? 0;

    return {
      competencyMonth: month,
      shortLabel: formatShortCompetencyMonth(month),
      income,
      expense,
      result: income - expense
    };
  });
}

function buildExpenseCategoryChartItems(
  expenseTotalsByCategory: DashboardCategoryTotal[],
  monthlyExpenseTotal: number
): DashboardExpenseCategoryChartItem[] {
  if (monthlyExpenseTotal <= 0) {
    return [];
  }

  const visibleItems = expenseTotalsByCategory.slice(0, maxVisibleExpenseCategories);
  const remainingItems = expenseTotalsByCategory.slice(maxVisibleExpenseCategories);

  const items = remainingItems.length
    ? [
        ...visibleItems,
        {
          categoryName: "Outras",
          totalAmount: remainingItems.reduce((sum, item) => sum + item.totalAmount, 0),
          transactionCount: remainingItems.reduce((sum, item) => sum + item.transactionCount, 0)
        }
      ]
    : visibleItems;

  return items.map((item) => ({
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    totalAmount: item.totalAmount,
    transactionCount: item.transactionCount,
    shareOfTotal: item.totalAmount / monthlyExpenseTotal
  }));
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function buildForecastSeries(
  monthlyHistory: DashboardHistoricalSeriesPoint[],
  competencyMonth: string
): {
  forecast: DashboardForecastSeriesPoint[];
  forecastDescription: string;
} {
  const referenceMonths = monthlyHistory
    .filter((point) => point.income > 0 || point.expense > 0)
    .slice(-forecastAverageWindow);

  if (referenceMonths.length === 0) {
    return {
      forecast: Array.from({ length: forecastMonthWindow }, (_, index) => {
        const month = shiftCompetencyMonth(competencyMonth, index + 1);

        return {
          competencyMonth: month,
          shortLabel: formatShortCompetencyMonth(month),
          estimatedIncome: 0,
          estimatedExpense: 0,
          estimatedResult: 0
        };
      }),
      forecastDescription: "Sem histórico aplicado suficiente. A previsão fica zerada até existir recorrência."
    };
  }

  const estimatedIncome = calculateAverage(referenceMonths.map((point) => point.income));
  const estimatedExpense = calculateAverage(referenceMonths.map((point) => point.expense));

  // Heurística simples: média aritmética dos últimos meses com movimentação aplicada.
  const forecast = Array.from({ length: forecastMonthWindow }, (_, index) => {
    const month = shiftCompetencyMonth(competencyMonth, index + 1);

    return {
      competencyMonth: month,
      shortLabel: formatShortCompetencyMonth(month),
      estimatedIncome,
      estimatedExpense,
      estimatedResult: estimatedIncome - estimatedExpense
    };
  });

  return {
    forecast,
    forecastDescription: `Estimativa pela média simples dos últimos ${referenceMonths.length} mês(es) com movimentação aplicada.`
  };
}

export function createEmptyDashboardAnalytics(competencyMonth: string): DashboardAnalytics {
  const monthlyHistory = buildHistoricalSeries([], competencyMonth);
  const { forecast, forecastDescription } = buildForecastSeries(monthlyHistory, competencyMonth);

  return {
    expenseInsight: {
      totalAmount: 0,
      transactionCount: 0,
      averagePreviousMonths: null,
      averageWindowSize: 0
    },
    expenseByCategory: [],
    monthlyHistory,
    forecast,
    forecastDescription
  };
}

export function buildDashboardAnalytics(input: {
  competencyMonth: string;
  allAppliedTransactions: Transaction[];
  monthlyExpenseTransactions: Transaction[];
  expenseTotalsByCategory: DashboardCategoryTotal[];
}): DashboardAnalytics {
  const monthlyHistory = buildHistoricalSeries(input.allAppliedTransactions, input.competencyMonth);
  const previousExpenseMonths = monthlyHistory
    .slice(0, -1)
    .filter((point) => point.expense > 0)
    .slice(-forecastAverageWindow);
  const averagePreviousMonths =
    previousExpenseMonths.length > 0 ? calculateAverage(previousExpenseMonths.map((point) => point.expense)) : null;
  const totalAmount = input.monthlyExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const topCategory = input.expenseTotalsByCategory[0];
  const { forecast, forecastDescription } = buildForecastSeries(monthlyHistory, input.competencyMonth);

  return {
    expenseInsight: {
      totalAmount,
      transactionCount: input.monthlyExpenseTransactions.length,
      averagePreviousMonths,
      averageWindowSize: previousExpenseMonths.length,
      topCategoryName: topCategory?.categoryName,
      topCategoryAmount: topCategory?.totalAmount
    },
    expenseByCategory: buildExpenseCategoryChartItems(input.expenseTotalsByCategory, totalAmount),
    monthlyHistory,
    forecast,
    forecastDescription
  };
}
