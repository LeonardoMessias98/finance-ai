import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { AccountForm } from "@/features/accounts/components/account-form";
import { AccountsList } from "@/features/accounts/components/accounts-list";
import { getAccountForEditing } from "@/features/accounts/services/get-account-for-editing-service";
import { listAccountsForManagement } from "@/features/accounts/services/list-accounts-for-management-service";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";

type AccountsPageProps = {
  editingAccountId?: string;
};

export async function AccountsPage({ editingAccountId }: AccountsPageProps) {
  const [accounts, editingAccount] = await Promise.all([
    listAccountsForManagement(),
    editingAccountId ? getAccountForEditing(editingAccountId) : Promise.resolve(null)
  ]);

  const activeAccounts = accounts.filter((account) => account.isActive);
  const inactiveAccounts = accounts.filter((account) => !account.isActive);
  const totalInitialBalance = accounts.reduce((sum, account) => sum + account.initialBalance, 0);
  const hasEditingError = Boolean(editingAccountId) && !editingAccount;

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Contas</h1>
          <p className="text-sm text-muted-foreground">{accounts.length} contas cadastradas</p>
        </div>

        {hasEditingError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            A conta selecionada para edição não foi encontrada. A página voltou ao modo de criação.
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-2 pt-5">
              <p className="text-sm text-muted-foreground">Saldo inicial</p>
              <p className="text-2xl font-semibold text-foreground">{formatAccountBalanceFromCents(totalInitialBalance)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 pt-5">
              <p className="text-sm text-muted-foreground">Ativas</p>
              <p className="text-2xl font-semibold text-foreground">{activeAccounts.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 pt-5">
              <p className="text-sm text-muted-foreground">Inativas</p>
              <p className="text-2xl font-semibold text-muted-foreground">{inactiveAccounts.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <AccountsList accounts={accounts} editingAccountId={editingAccount?.id} />
          <AccountForm account={editingAccount} />
        </div>
      </section>
    </AppShell>
  );
}
