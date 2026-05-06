"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { transactionsAccountKindGroupStyles } from "@/features/transactions/components/transactions-list.styles";
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
    <section aria-label={`Grupo ${title}`} className={transactionsAccountKindGroupStyles.section}>
      <button
        aria-controls={contentId}
        aria-expanded={isExpanded}
        className={transactionsAccountKindGroupStyles.toggle}
        onClick={() => setIsExpanded((currentValue) => !currentValue)}
        type="button"
      >
        <span className={transactionsAccountKindGroupStyles.title}>{title}</span>
        <span className={transactionsAccountKindGroupStyles.summary}>
          {summaryLabel}: <span className={transactionsAccountKindGroupStyles.summaryValue}>{summaryValue}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(transactionsAccountKindGroupStyles.icon, isExpanded ? "rotate-180" : "")}
          />
        </span>
      </button>
      {description ? <p className={transactionsAccountKindGroupStyles.description}>{description}</p> : null}

      {isExpanded ? (
        <div className={transactionsAccountKindGroupStyles.content} id={contentId}>
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
