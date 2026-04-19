export type DashboardExpenseInsight = {
  totalAmount: number;
  transactionCount: number;
  averagePreviousMonths: number | null;
  averageWindowSize: number;
  topCategoryName?: string;
  topCategoryAmount?: number;
};

export type DashboardExpenseCategoryChartItem = {
  categoryId?: string;
  categoryName: string;
  totalAmount: number;
  transactionCount: number;
  shareOfTotal: number;
};

export type DashboardHistoricalSeriesPoint = {
  competencyMonth: string;
  shortLabel: string;
  income: number;
  expense: number;
  result: number;
};

export type DashboardForecastSeriesPoint = {
  competencyMonth: string;
  shortLabel: string;
  estimatedIncome: number;
  estimatedExpense: number;
  estimatedResult: number;
};

export type DashboardAnalytics = {
  expenseInsight: DashboardExpenseInsight;
  expenseByCategory: DashboardExpenseCategoryChartItem[];
  monthlyHistory: DashboardHistoricalSeriesPoint[];
  forecast: DashboardForecastSeriesPoint[];
  forecastDescription: string;
};
