import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { MobileOnlyModalShell } from "@/components/ui/mobile-only-modal-shell";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/ui/status-banner";
import { AccountForm } from "@/features/accounts/components/account-form";
import { AccountsList } from "@/features/accounts/components/accounts-list";
import { getAccountForEditing } from "@/features/accounts/services/get-account-for-editing-service";
import { listAccountsForManagement } from "@/features/accounts/services/list-accounts-for-management-service";
import { buildAccountsHref } from "@/features/accounts/utils/build-accounts-href";
import Link from "next/link";

type AccountsPageProps = {
  editingAccountId?: string;
  isCreateModalOpen?: boolean;
};

export async function AccountsPage({ editingAccountId, isCreateModalOpen = false }: AccountsPageProps) {
  const [accounts, editingAccount] = await Promise.all([
    listAccountsForManagement(),
    editingAccountId ? getAccountForEditing(editingAccountId) : Promise.resolve(null)
  ]);

  const hasEditingError = Boolean(editingAccountId) && !editingAccount;
  const returnHref = buildAccountsHref();
  const createHref = buildAccountsHref({
    create: true
  });
  const isMobileModalOpen = isCreateModalOpen || Boolean(editingAccount);

  return (
    <AuthenticatedAppShell>
      <PageSection>
        <PageHeader
          actions={
            <Button asChild className="lg:hidden" type="button">
              <Link href={createHref}>Nova conta</Link>
            </Button>
          }
          description={`${accounts.length} contas cadastradas`}
          title="Contas"
        />

        {hasEditingError ? (
          <StatusBanner
            message="A conta selecionada para edição não foi encontrada. A página voltou ao modo de criação."
            variant="error"
          />
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <AccountsList accounts={accounts} editingAccountId={editingAccount?.id} />
          <div className="hidden lg:block">
            <AccountForm account={editingAccount} returnHref={returnHref} />
          </div>
        </div>

        {isMobileModalOpen ? (
          <MobileOnlyModalShell closeHref={returnHref} mobileFullscreen title={editingAccount ? "Editar conta" : "Nova conta"}>
            <AccountForm account={editingAccount} closeOnSuccess returnHref={returnHref} showCard={false} />
          </MobileOnlyModalShell>
        ) : null}
      </PageSection>
    </AuthenticatedAppShell>
  );
}
