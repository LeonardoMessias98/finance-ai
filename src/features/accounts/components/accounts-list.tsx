import Link from "next/link";
import { Landmark, PencilLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountStatusToggleButton } from "@/features/accounts/components/account-status-toggle-button";
import type { Account } from "@/features/accounts/types/account";
import { formatAccountBalanceFromCents, getAccountTypeLabel } from "@/features/accounts/utils/account-formatters";
import { cn } from "@/lib/utils";

type AccountsListProps = {
  accounts: Account[];
  editingAccountId?: string;
};

export function AccountsList({ accounts, editingAccountId }: AccountsListProps) {
  return (
    <Card className="border-primary/10 bg-card/85">
      <CardHeader className="space-y-1">
        <CardTitle className="font-display text-3xl">Contas cadastradas</CardTitle>
        <CardDescription>
          A listagem exibe contas ativas e inativas. Nos selects operacionais, o padrão deve ser usar apenas contas ativas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-background/60 px-5 py-8 text-center text-sm text-muted-foreground">
            Nenhuma conta cadastrada ainda. Use o formulário ao lado para criar a primeira conta financeira.
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                className={cn(
                  "grid gap-4 rounded-[1.5rem] border border-border/80 bg-background/70 p-4 lg:grid-cols-[1fr_auto]",
                  editingAccountId === account.id ? "border-primary/40 bg-primary/5" : ""
                )}
                key={account.id}
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
                      <p className="text-lg font-semibold text-foreground">{account.name}</p>
                      <Badge variant={account.isActive ? "default" : "secondary"}>
                        {account.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                      <Badge variant="outline">{getAccountTypeLabel(account.type)}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>Saldo inicial {formatAccountBalanceFromCents(account.initialBalance)}</span>
                      {account.icon ? <span>Ícone {account.icon}</span> : null}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-start gap-3 lg:justify-end">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/accounts?accountId=${account.id}`}>
                      <PencilLine className="h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  <AccountStatusToggleButton accountId={account.id} isActive={account.isActive} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
