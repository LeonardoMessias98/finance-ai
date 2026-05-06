import { Card, CardContent } from "@/components/ui/card";
import {
  getMonthlyResultClassName,
  transactionsListStyles
} from "@/features/transactions/components/transactions-list.styles";
import type { MonthlyDebitSummary } from "@/features/transactions/components/transactions-page.types";
import { formatTransactionAmountFromCents } from "@/features/transactions/utils/transaction-formatters";

type TransactionsMonthlySummaryProps = {
  summary: MonthlyDebitSummary;
};

export function TransactionsMonthlySummary({ summary }: TransactionsMonthlySummaryProps) {
  return (
    <Card>
      <CardContent className={transactionsListStyles.monthlySummaryGrid}>
        <div className={transactionsListStyles.monthlyStat}>
          <p className={transactionsListStyles.monthlyLabel}>Entradas</p>
          <p className={transactionsListStyles.monthlyIncome}>
            {formatTransactionAmountFromCents(summary.incomeAmount)}
          </p>
        </div>

        <div className={transactionsListStyles.monthlyStat}>
          <p className={transactionsListStyles.monthlyLabel}>Saídas</p>
          <p className={transactionsListStyles.monthlyExpense}>
            {formatTransactionAmountFromCents(summary.expenseAmount)}
          </p>
        </div>

        <div className={transactionsListStyles.monthlyStat}>
          <p className={transactionsListStyles.monthlyLabel}>Resultado</p>
          <p className={getMonthlyResultClassName(summary.resultAmount)}>
            {formatTransactionAmountFromCents(summary.resultAmount)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
