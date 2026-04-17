import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentCompetencyMonth } from "@/lib/dates/competency-month";

export function AppHeader() {
  const currentCompetencyMonth = getCurrentCompetencyMonth();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/88 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
          <Link className="inline-flex items-center gap-3" href="/">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold text-foreground">
              F
            </span>
            <span className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-foreground">finance-ai</span>
              <span className="text-xs text-muted-foreground">controle pessoal</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <Link className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground" href="/">
              Início
            </Link>
            <Link
              className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
              href="/transactions"
            >
              Histórico
            </Link>
            <Link
              className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
              href="/accounts"
            >
              Contas
            </Link>
            <Link
              className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
              href="/categories"
            >
              Categorias
            </Link>
            <Link
              className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
              href="/budgets"
            >
              Orçamentos
            </Link>
            <Link
              className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
              href="/goals"
            >
              Metas
            </Link>
          </nav>
        </div>

        <Button asChild>
          <Link href={`/transactions?competencyMonth=${currentCompetencyMonth}`}>Nova transação</Link>
        </Button>
      </div>
    </header>
  );
}
