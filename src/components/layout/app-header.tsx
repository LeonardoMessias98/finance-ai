import Link from "next/link";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { OpenTransactionModalButton } from "@/features/transactions/components/open-transaction-modal-button";

const navigationLinks = [
  {
    href: "/",
    label: "Início"
  },
  {
    href: "/transactions",
    label: "Histórico"
  },
  {
    href: "/accounts",
    label: "Contas"
  },
  {
    href: "/categories",
    label: "Categorias"
  },
  {
    href: "/budgets",
    label: "Orçamentos"
  },
  {
    href: "/goals",
    label: "Metas"
  }
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/88 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          aria-label="Início"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold text-foreground"
          href="/"
        >
          F
        </Link>

        <nav className="min-w-0 flex-1 overflow-x-auto">
          <div className="flex min-w-max items-center gap-1 pr-2 text-sm">
            {navigationLinks.map((link) => (
              <Link
                className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <OpenTransactionModalButton className="shrink-0 px-3 sm:px-4">Nova transação</OpenTransactionModalButton>

        <LogoutButton />
      </div>
    </header>
  );
}
