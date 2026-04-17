import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC"
});

export function formatGoalAmountFromCents(amountInCents: number): string {
  return formatAccountBalanceFromCents(amountInCents);
}

export function formatGoalDate(date: Date): string {
  return dateFormatter.format(date);
}

export function getGoalStatusLabel(isCompleted: boolean): string {
  return isCompleted ? "Concluída" : "Em andamento";
}
