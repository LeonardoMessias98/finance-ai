import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { FamilyCategoryExpenseCharts } from "@/features/families/components/family-category-expense-charts";
import { getFamilyFinancialSummary } from "@/features/families/services/get-family-financial-summary-service";
import type { FamilyMemberFinancialSummary } from "@/features/families/types/family-financial-summary";
import {
  formatTransactionAmountFromCents,
  formatTransactionCompetencyMonth,
  formatTransactionDate,
  getTransactionTypeLabel
} from "@/features/transactions/utils/transaction-formatters";

type FamilyPageProps = {
  competencyMonth: string;
};

function FamilyMemberCard({ member }: { member: FamilyMemberFinancialSummary }) {
  return (
    <Card aria-label={`Resumo de ${member.displayName}`} className="border-primary/10 bg-card/85" role="region">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-xl">{member.displayName}</CardTitle>
          <Badge variant={member.role === "owner" ? "default" : "secondary"}>
            {member.role === "owner" ? "Owner" : "Membro"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Saldo</p>
            <p className="text-lg font-semibold text-foreground">
              {formatAccountBalanceFromCents(member.totalCurrentBalance)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Entradas débito</p>
            <p className="text-lg font-semibold text-income">
              {formatAccountBalanceFromCents(member.monthlyDebitIncome)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Gastos débito</p>
            <p className="text-lg font-semibold text-destructive">
              {formatAccountBalanceFromCents(member.monthlyDebitExpense)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Gastos crédito</p>
            <p className="text-lg font-semibold text-foreground">
              {formatAccountBalanceFromCents(member.monthlyCreditExpense)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Resultado débito</p>
            <p className="text-lg font-semibold text-foreground">
              {formatAccountBalanceFromCents(member.monthlyResult)}
            </p>
          </div>
        </div>

        {member.latestTransactions.length > 0 ? (
          <div className="space-y-2">
            {member.latestTransactions.slice(0, 3).map((transaction) => (
              <div
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background/70 px-3 py-2 text-sm"
                key={transaction.id}
              >
                <div>
                  <p className="font-medium text-foreground">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTransactionDate(transaction.date)} · {getTransactionTypeLabel(transaction.type)}
                  </p>
                </div>
                <p className="font-semibold text-foreground">
                  {formatTransactionAmountFromCents(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState className="bg-background/60" message="Sem transações no mês." />
        )}
      </CardContent>
    </Card>
  );
}

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

        {!summary ? (
          <EmptyState
            className="bg-card"
            message="Você ainda não participa de uma família com visualização compartilhada."
          />
        ) : (
          <>
            <Card aria-label="Resumo consolidado da família" role="region">
              <CardContent className="grid gap-4 pt-5 sm:grid-cols-2 xl:grid-cols-5">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Saldo familiar</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatAccountBalanceFromCents(summary.totalCurrentBalance)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Entradas débito</p>
                  <p className="text-2xl font-semibold text-income">
                    {formatAccountBalanceFromCents(summary.monthlyDebitIncome)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Gastos débito</p>
                  <p className="text-2xl font-semibold text-destructive">
                    {formatAccountBalanceFromCents(summary.monthlyDebitExpense)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Gastos crédito</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatAccountBalanceFromCents(summary.monthlyCreditExpense)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Resultado débito</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatAccountBalanceFromCents(summary.monthlyResult)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
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
