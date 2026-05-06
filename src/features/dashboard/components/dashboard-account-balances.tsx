import { Landmark } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { dashboardListCardsStyles } from "@/features/dashboard/components/dashboard-list-cards.styles";
import type { DashboardAccountBalance } from "@/features/dashboard/types/dashboard-financial-summary";
import { formatAccountBalanceFromCents, getAccountTypeLabel } from "@/features/accounts/utils/account-formatters";

type DashboardAccountBalancesProps = {
  accountBalances: DashboardAccountBalance[];
};

export function DashboardAccountBalances({ accountBalances }: DashboardAccountBalancesProps) {
  return (
    <Card className={dashboardListCardsStyles.card}>
      <CardHeader className={dashboardListCardsStyles.header}>
        <CardTitle className={dashboardListCardsStyles.title}>Saldo por conta na competência</CardTitle>
        <CardDescription>
          O cálculo considera saldo inicial e apenas transações aplicadas dentro do mês selecionado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {accountBalances.length === 0 ? (
          <EmptyState
            className={dashboardListCardsStyles.emptyState}
            message="Cadastre contas e transações para ver o saldo consolidado na competência selecionada."
          />
        ) : (
          <div className={dashboardListCardsStyles.list}>
            {accountBalances.map((account) => (
              <div
                className={dashboardListCardsStyles.accountItem}
                key={account.accountId}
              >
                <div className={dashboardListCardsStyles.accountMain}>
                  <div
                    className={dashboardListCardsStyles.accountIcon}
                    style={{
                      backgroundColor: account.color ?? "hsl(156 54% 27%)"
                    }}
                  >
                    <Landmark className={dashboardListCardsStyles.accountIconSvg} />
                  </div>
                  <div className={dashboardListCardsStyles.accountContent}>
                    <div className={dashboardListCardsStyles.accountTitleRow}>
                      <p className={dashboardListCardsStyles.accountName}>{account.accountName}</p>
                      <Badge variant="outline">{getAccountTypeLabel(account.accountType)}</Badge>
                      {!account.isActive ? <Badge variant="secondary">Inativa</Badge> : null}
                    </div>
                    <p className={dashboardListCardsStyles.description}>Saldo consolidado na competência selecionada.</p>
                  </div>
                </div>
                <div className={dashboardListCardsStyles.valueContainer}>
                  <p className={dashboardListCardsStyles.value}>
                    {formatAccountBalanceFromCents(account.currentBalance)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
