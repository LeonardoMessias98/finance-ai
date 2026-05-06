import Link from "next/link";
import { Plus } from "lucide-react";

import { appHeaderStyles } from "@/components/layout/app-header.styles";
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
    href: "/family",
    label: "Família"
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
    <header className={appHeaderStyles.header}>
      <div className={appHeaderStyles.container}>
        <Link
          aria-label="Início"
          className={appHeaderStyles.brandLink}
          href="/"
        >
          F
        </Link>

        <nav className={appHeaderStyles.navigation}>
          <div className={appHeaderStyles.navigationList}>
            {navigationLinks.map((link) => (
              <Link
                className={appHeaderStyles.navigationLink}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <OpenTransactionModalButton
          aria-label="Nova transação"
          className={appHeaderStyles.transactionButton}
        >
          <Plus aria-hidden="true" className={appHeaderStyles.transactionIcon} />
          <span className={appHeaderStyles.transactionText}>Nova transação</span>
        </OpenTransactionModalButton>

        <LogoutButton />
      </div>
    </header>
  );
}
