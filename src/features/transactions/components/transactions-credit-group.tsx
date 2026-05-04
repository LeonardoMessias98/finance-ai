"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type TransactionsCreditGroupProps = {
  title: string;
  totalLabel: string;
  children: ReactNode;
};

type TransactionsAccountKindGroupProps = {
  title: string;
  summaryLabel: string;
  summaryValue: string;
  description?: string;
  children: ReactNode;
};

export function TransactionsAccountKindGroup({
  title,
  summaryLabel,
  summaryValue,
  description,
  children
}: TransactionsAccountKindGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();

  return (
    <section aria-label={`Grupo ${title}`} className="space-y-4">
      <button
        aria-controls={contentId}
        aria-expanded={isExpanded}
        className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-left transition-colors hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={() => setIsExpanded((currentValue) => !currentValue)}
        type="button"
      >
        <span className="text-base font-semibold text-foreground">{title}</span>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {summaryLabel}: <span className="text-foreground">{summaryValue}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn("h-4 w-4 transition-transform", isExpanded ? "rotate-180" : "")}
          />
        </span>
      </button>
      {description ? <p className="px-1 text-xs leading-relaxed text-muted-foreground">{description}</p> : null}

      {isExpanded ? (
        <div className="space-y-5" id={contentId}>
          {children}
        </div>
      ) : null}
    </section>
  );
}

export function TransactionsCreditGroup({ title, totalLabel, children }: TransactionsCreditGroupProps) {
  return (
    <TransactionsAccountKindGroup
      description="Compras no crédito aparecem aqui, mas só afetam o saldo quando a fatura é paga."
      summaryLabel="Total"
      summaryValue={totalLabel}
      title={title}
    >
      {children}
    </TransactionsAccountKindGroup>
  );
}
