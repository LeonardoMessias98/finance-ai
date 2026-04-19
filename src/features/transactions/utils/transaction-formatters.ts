import { statusByTransactionType } from "@/features/transactions/schemas/transaction-schema";
import type {
  TransactionStatus,
  TransactionType
} from "@/features/transactions/types/transaction";

const transactionTypeLabelMap: Record<TransactionType, string> = {
  income: "Receita",
  expense: "Despesa"
};

const transactionStatusLabelMap: Record<TransactionStatus, string> = {
  planned: "Planejada",
  paid: "Paga",
  received: "Recebida",
  overdue: "Em atraso"
};

const defaultStatusByTransactionType: Record<TransactionType, TransactionStatus> = {
  income: "received",
  expense: "paid"
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC"
});

const competencyMonthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC"
});

export function getTransactionTypeLabel(transactionType: TransactionType): string {
  return transactionTypeLabelMap[transactionType];
}

export function getTransactionStatusLabel(transactionStatus: TransactionStatus): string {
  return transactionStatusLabelMap[transactionStatus];
}

export function getDefaultTransactionStatus(transactionType: TransactionType): TransactionStatus {
  return defaultStatusByTransactionType[transactionType];
}

export function getTransactionStatusOptions(transactionType: TransactionType): readonly TransactionStatus[] {
  return statusByTransactionType[transactionType];
}

export function getTransactionTypeDotClassName(transactionType: TransactionType): string {
  if (transactionType === "income") {
    return "bg-green-500";
  }

  return "bg-destructive";
}

export function getTransactionTypeAmountClassName(transactionType: TransactionType): string {
  if (transactionType === "income") {
    return "text-income";
  }

  return "text-destructive";
}

export function formatTransactionAmountFromCents(amountInCents: number): string {
  return currencyFormatter.format(amountInCents / 100);
}

export function formatTransactionDate(date: Date): string {
  return dateFormatter.format(date);
}

export function formatTransactionCompetencyMonth(competencyMonth: string): string {
  const [year, month] = competencyMonth.split("-").map(Number);

  return competencyMonthFormatter.format(new Date(Date.UTC(year, month - 1, 1, 12)));
}
