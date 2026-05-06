import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { familyMemberCardStyles } from "@/features/families/components/family-member-card.styles";
import type { FamilyMemberFinancialSummary } from "@/features/families/types/family-financial-summary";
import {
  formatTransactionAmountFromCents,
  formatTransactionDate,
  getTransactionTypeLabel
} from "@/features/transactions/utils/transaction-formatters";

const creditVisualizationHint =
  "Crédito aparece apenas como visualização. O saldo muda quando a fatura é paga no débito.";

export function FamilyMemberCard({ member }: { member: FamilyMemberFinancialSummary }) {
  return (
    <Card aria-label={`Resumo de ${member.displayName}`} className={familyMemberCardStyles.card} role="region">
      <CardHeader className={familyMemberCardStyles.header}>
        <div className={familyMemberCardStyles.titleRow}>
          <CardTitle className="text-xl">{member.displayName}</CardTitle>
          <Badge variant={member.role === "owner" ? "default" : "secondary"}>
            {member.role === "owner" ? "Owner" : "Membro"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={familyMemberCardStyles.content}>
        <div className={familyMemberCardStyles.summaryGrid}>
          <div className={familyMemberCardStyles.debitPanel}>
            <div className={familyMemberCardStyles.panelHeader}>
              <p className={familyMemberCardStyles.panelTitle}>Débito</p>
              <p className={familyMemberCardStyles.panelHint}>Saldo disponível</p>
            </div>
            <p className={familyMemberCardStyles.availableBalance}>
              {formatAccountBalanceFromCents(member.totalCurrentBalance)}
            </p>

            <div className={familyMemberCardStyles.debitStatsGrid}>
              <div className={familyMemberCardStyles.stat}>
                <p className={familyMemberCardStyles.statLabel}>Entradas débito</p>
                <p className={familyMemberCardStyles.incomeValue}>
                  {formatAccountBalanceFromCents(member.monthlyDebitIncome)}
                </p>
              </div>
              <div className={familyMemberCardStyles.stat}>
                <p className={familyMemberCardStyles.statLabel}>Gastos débito</p>
                <p className={familyMemberCardStyles.expenseValue}>
                  {formatAccountBalanceFromCents(member.monthlyDebitExpense)}
                </p>
              </div>
              <div className={familyMemberCardStyles.stat}>
                <p className={familyMemberCardStyles.statLabel}>Resultado débito</p>
                <p className={familyMemberCardStyles.resultValue}>
                  {formatAccountBalanceFromCents(member.monthlyResult)}
                </p>
              </div>
            </div>
          </div>

          <div className={familyMemberCardStyles.creditPanel}>
            <p className={familyMemberCardStyles.panelTitle}>Crédito</p>
            <div className={familyMemberCardStyles.creditStat}>
              <p className={familyMemberCardStyles.statLabel}>Gastos crédito</p>
              <p className={familyMemberCardStyles.creditValue}>
                {formatAccountBalanceFromCents(member.monthlyCreditExpense)}
              </p>
            </div>
            <p className={familyMemberCardStyles.creditHint}>{creditVisualizationHint}</p>
          </div>
        </div>

        {member.latestTransactions.length > 0 ? (
          <div className={familyMemberCardStyles.latestList}>
            {member.latestTransactions.slice(0, 3).map((transaction) => (
              <div
                className={familyMemberCardStyles.latestItem}
                key={transaction.id}
              >
                <div>
                  <p className={familyMemberCardStyles.latestDescription}>{transaction.description}</p>
                  <p className={familyMemberCardStyles.latestMeta}>
                    {formatTransactionDate(transaction.date)} · {getTransactionTypeLabel(transaction.type)}
                  </p>
                </div>
                <p className={familyMemberCardStyles.latestAmount}>
                  {formatTransactionAmountFromCents(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState className={familyMemberCardStyles.emptyState} message="Sem transações no mês." />
        )}
      </CardContent>
    </Card>
  );
}
