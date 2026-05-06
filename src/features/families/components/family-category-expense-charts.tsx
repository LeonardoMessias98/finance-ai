import { CategoryExpensePieChart } from "@/components/ui/category-expense-pie-chart";
import { buildFamilyMemberCategoryChartData } from "@/features/families/components/family-category-expense-charts.helpers";
import { familyCategoryExpenseChartsStyles } from "@/features/families/components/family-category-expense-charts.styles";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import type { FamilyMemberFinancialSummary } from "@/features/families/types/family-financial-summary";

type FamilyCategoryExpenseChartsProps = {
  members: FamilyMemberFinancialSummary[];
};

function FamilyMemberCategoryChart({ member }: { member: FamilyMemberFinancialSummary }) {
  const { creditChartData, debitChartData } = buildFamilyMemberCategoryChartData(member);

  return (
    <div className={familyCategoryExpenseChartsStyles.memberRegion} role="region" aria-label={`Gastos por categoria de ${member.displayName}`}>
      <h3 className={familyCategoryExpenseChartsStyles.memberTitle}>{member.displayName}</h3>

      <div className={familyCategoryExpenseChartsStyles.chartsGrid}>
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
    <section className={familyCategoryExpenseChartsStyles.section} aria-labelledby="family-category-expenses-title">
      <div className={familyCategoryExpenseChartsStyles.header}>
        <h2 className={familyCategoryExpenseChartsStyles.title} id="family-category-expenses-title">
          Gastos por categoria
        </h2>
        <p className={familyCategoryExpenseChartsStyles.description}>Categorias com mais despesas por membro no mês selecionado.</p>
      </div>

      <div className={familyCategoryExpenseChartsStyles.memberList}>
        {members.map((member) => (
          <FamilyMemberCategoryChart key={member.userId} member={member} />
        ))}
      </div>
    </section>
  );
}
