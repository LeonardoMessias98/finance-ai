import { Landmark } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { DashboardAccountBalance } from "@/features/dashboard/types/dashboard-financial-summary";
import { formatAccountBalanceFromCents, getAccountTypeLabel } from "@/features/accounts/utils/account-formatters";

type DashboardAccountBalancesProps = {
  accountBalances: DashboardAccountBalance[];
};

export function DashboardAccountBalances({ accountBalances }: DashboardAccountBalancesProps) {
  return (
    <Card className="border-primary/10 bg-card/85">
      <CardHeader className="space-y-1">
        <CardTitle className="font-display text-3xl">Saldo por conta na competência</CardTitle>
        <CardDescription>
          O cálculo considera saldo inicial e apenas transações aplicadas dentro do mês selecionado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {accountBalances.length === 0 ? (
          <EmptyState
            className="bg-background/60"
            message="Cadastre contas e transações para ver o saldo consolidado na competência selecionada."
          />
        ) : (
          <div className="space-y-3">
            {accountBalances.map((account) => (
              <div
                className="grid gap-4 rounded-[1.5rem] border border-border/80 bg-background/70 p-4 lg:grid-cols-[1fr_auto]"
                key={account.accountId}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
                    style={{
                      backgroundColor: account.color ?? "hsl(156 54% 27%)"
                    }}
                  >
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{account.accountName}</p>
                      <Badge variant="outline">{getAccountTypeLabel(account.accountType)}</Badge>
                      {!account.isActive ? <Badge variant="secondary">Inativa</Badge> : null}
                    </div>
                    <p className="text-sm text-muted-foreground">Saldo consolidado na competência selecionada.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
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
