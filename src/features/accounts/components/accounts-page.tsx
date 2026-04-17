import { AppShell } from "@/components/layout/app-shell";
import { AccountForm } from "@/features/accounts/components/account-form";
import { AccountsList } from "@/features/accounts/components/accounts-list";
import { getAccountForEditing } from "@/features/accounts/services/get-account-for-editing-service";
import { listAccountsForManagement } from "@/features/accounts/services/list-accounts-for-management-service";

type AccountsPageProps = {
  editingAccountId?: string;
};

export async function AccountsPage({ editingAccountId }: AccountsPageProps) {
  const [accounts, editingAccount] = await Promise.all([
    listAccountsForManagement(),
    editingAccountId ? getAccountForEditing(editingAccountId) : Promise.resolve(null)
  ]);

  const hasEditingError = Boolean(editingAccountId) && !editingAccount;

  return (
    <AppShell>
      <section className="space-y-6 pt-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Contas</h1>
          <p className="text-sm text-muted-foreground">{accounts.length} contas cadastradas</p>
        </div>

        {hasEditingError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            A conta selecionada para edição não foi encontrada. A página voltou ao modo de criação.
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <AccountsList accounts={accounts} editingAccountId={editingAccount?.id} />
          <AccountForm account={editingAccount} />
        </div>
      </section>
    </AppShell>
  );
}
