import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { listOperationalAccounts } from "@/features/accounts/services/list-operational-accounts-service";
import { listOperationalCategories } from "@/features/categories/services/list-operational-categories-service";
import { SessionKeepAlive } from "@/features/auth/components/session-keep-alive";
import { GlobalTransactionModalProvider } from "@/features/transactions/context/global-transaction-modal-provider";

type AuthenticatedAppShellProps = {
  children: ReactNode;
};

export async function AuthenticatedAppShell({ children }: AuthenticatedAppShellProps) {
  const [accounts, categories] = await Promise.all([listOperationalAccounts(), listOperationalCategories()]);

  return (
    <GlobalTransactionModalProvider accounts={accounts} categories={categories}>
      <AppShell
        header={
          <>
            <SessionKeepAlive />
            <AppHeader />
          </>
        }
      >
        {children}
      </AppShell>
    </GlobalTransactionModalProvider>
  );
}
