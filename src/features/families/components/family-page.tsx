import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { FamilyCategoryExpenseCharts } from "@/features/families/components/family-category-expense-charts";
import { FamilyMemberCard } from "@/features/families/components/family-member-card";
import { FamilyMonthFilter } from "@/features/families/components/family-month-filter";
import { familyPageStyles } from "@/features/families/components/family-page.styles";
import { getFamilyFinancialSummary } from "@/features/families/services/get-family-financial-summary-service";
import { formatTransactionCompetencyMonth } from "@/features/transactions/utils/transaction-formatters";

type FamilyPageProps = {
  competencyMonth: string;
};

export async function FamilyPage({ competencyMonth }: FamilyPageProps) {
  const summary = await getFamilyFinancialSummary({
    competencyMonth
  });

  return (
    <AuthenticatedAppShell>
      <PageSection>
        <PageHeader
          description={formatTransactionCompetencyMonth(competencyMonth)}
          title={summary ? summary.family.name : "Família"}
        />
        <FamilyMonthFilter competencyMonth={competencyMonth} />

        {!summary ? (
          <EmptyState
            className={familyPageStyles.emptyState}
            message="Você ainda não participa de uma família com visualização compartilhada."
          />
        ) : (
          <>
            <Card aria-label="Resumo consolidado da família" role="region">
              <CardContent className={familyPageStyles.summaryGrid}>
                <div className={familyPageStyles.stat}>
                  <p className={familyPageStyles.label}>Saldo familiar</p>
                  <p className={familyPageStyles.foregroundValue}>
                    {formatAccountBalanceFromCents(summary.totalCurrentBalance)}
                  </p>
                </div>
                <div className={familyPageStyles.stat}>
                  <p className={familyPageStyles.label}>Entradas débito</p>
                  <p className={familyPageStyles.incomeValue}>
                    {formatAccountBalanceFromCents(summary.monthlyDebitIncome)}
                  </p>
                </div>
                <div className={familyPageStyles.stat}>
                  <p className={familyPageStyles.label}>Gastos débito</p>
                  <p className={familyPageStyles.expenseValue}>
                    {formatAccountBalanceFromCents(summary.monthlyDebitExpense)}
                  </p>
                </div>
                <div className={familyPageStyles.stat}>
                  <p className={familyPageStyles.label}>Gastos crédito</p>
                  <p className={familyPageStyles.foregroundValue}>
                    {formatAccountBalanceFromCents(summary.monthlyCreditExpense)}
                  </p>
                </div>
                <div className={familyPageStyles.stat}>
                  <p className={familyPageStyles.label}>Resultado débito</p>
                  <p className={familyPageStyles.foregroundValue}>
                    {formatAccountBalanceFromCents(summary.monthlyResult)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className={familyPageStyles.membersGrid}>
              {summary.members.map((member) => (
                <FamilyMemberCard key={member.userId} member={member} />
              ))}
            </div>

            <FamilyCategoryExpenseCharts members={summary.members} />
          </>
        )}
      </PageSection>
    </AuthenticatedAppShell>
  );
}
