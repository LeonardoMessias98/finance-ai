import Link from "next/link";
import { PencilLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountDeleteButton } from "@/features/accounts/components/account-delete-button";
import { AccountStatusToggleButton } from "@/features/accounts/components/account-status-toggle-button";
import type { Account } from "@/features/accounts/types/account";
import { formatAccountBalanceFromCents, getAccountTypeLabel } from "@/features/accounts/utils/account-formatters";
import { cn } from "@/lib/utils";

type AccountsListProps = {
  accounts: Account[];
  editingAccountId?: string;
};

export function AccountsList({ accounts, editingAccountId }: AccountsListProps) {
  const redirectHref = "/accounts";

  return (
    <Card className="border-primary/10 bg-card/85">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Contas</CardTitle>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-background/60 px-5 py-8 text-center text-sm text-muted-foreground">
            Nenhuma conta cadastrada.
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                className={cn(
                  "grid gap-8 rounded-[1.5rem] border border-border/80 bg-background/70 p-4",
                  editingAccountId === account.id ? "border-primary/40 bg-primary/5" : ""
                )}
                key={account.id}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="mt-1 h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor: account.color ?? "hsl(156 54% 27%)"
                    }}
                  />
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{account.name}</p>
                      <Badge variant={account.isActive ? "default" : "secondary"}>
                        {account.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                      <Badge variant="outline">{getAccountTypeLabel(account.type)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Saldo inicial {formatAccountBalanceFromCents(account.initialBalance)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-start gap-3 lg:justify-end">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/accounts?accountId=${account.id}`}>
                      <PencilLine className="h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  <AccountDeleteButton accountId={account.id} redirectHref={redirectHref} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
