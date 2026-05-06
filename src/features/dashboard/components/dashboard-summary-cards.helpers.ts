import type { DashboardCreditAccountSummary } from "@/features/dashboard/types/dashboard-financial-summary";

export type DashboardCreditTotals = {
  spentAmount: number;
  paidAmount: number;
  openAmount: number;
};

export function calculateDashboardCreditTotals(
  creditAccountSummaries: DashboardCreditAccountSummary[]
): DashboardCreditTotals {
  return creditAccountSummaries.reduce<DashboardCreditTotals>(
    (totals, account) => ({
      spentAmount: totals.spentAmount + account.spentAmount,
      paidAmount: totals.paidAmount + account.paidAmount,
      openAmount: totals.openAmount + account.openAmount
    }),
    {
      spentAmount: 0,
      paidAmount: 0,
      openAmount: 0
    }
  );
}
