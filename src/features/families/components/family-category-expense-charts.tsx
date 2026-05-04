import { CategoryExpensePieChart } from "@/components/ui/category-expense-pie-chart";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import type { FamilyMemberFinancialSummary } from "@/features/families/types/family-financial-summary";

type FamilyCategoryExpenseChartsProps = {
  members: FamilyMemberFinancialSummary[];
};

function FamilyMemberCategoryChart({ member }: { member: FamilyMemberFinancialSummary }) {
  const debitChartData = member.expenseCategoryBreakdown.debit.expensesByCategory.map((item) => ({
    categoryName: item.categoryName,
    amount: item.amount,
    percentage: item.percentage
  }));
  const creditChartData = member.expenseCategoryBreakdown.credit.expensesByCategory.map((item) => ({
    categoryName: item.categoryName,
    amount: item.amount,
    percentage: item.percentage
  }));

  return (
    <div className="space-y-3" role="region" aria-label={`Gastos por categoria de ${member.displayName}`}>
      <h3 className="text-lg font-semibold text-foreground">{member.displayName}</h3>

      <div className="grid gap-4 xl:grid-cols-2">
        <CategoryExpensePieChart
          data={debitChartData}
          description={`${formatAccountBalanceFromCents(
            member.expenseCategoryBreakdown.debit.totalExpenses
          )} em despesas de débito no mês.`}
          emptyMessage="Sem gastos de débito por categoria neste mês."
          title="Débito"
        />
        <CategoryExpensePieChart
          data={creditChartData}
          description={`${formatAccountBalanceFromCents(
            member.expenseCategoryBreakdown.credit.totalExpenses
          )} em despesas de crédito no mês.`}
          emptyMessage="Sem gastos de crédito por categoria neste mês."
          title="Crédito"
        />
      </div>
    </div>
  );
}

export function FamilyCategoryExpenseCharts({ members }: FamilyCategoryExpenseChartsProps) {
  return (
    <section className="space-y-4" aria-labelledby="family-category-expenses-title">
      <div>
        <h2 className="text-xl font-semibold text-foreground" id="family-category-expenses-title">
          Gastos por categoria
        </h2>
        <p className="text-sm text-muted-foreground">Categorias com mais despesas por membro no mês selecionado.</p>
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <FamilyMemberCategoryChart key={member.userId} member={member} />
        ))}
      </div>
    </section>
  );
}
