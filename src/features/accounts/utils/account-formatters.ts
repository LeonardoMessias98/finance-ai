import type { AccountType } from "@/features/accounts/types/account";

const accountTypeLabelMap: Record<AccountType, string> = {
  debit: "Débito",
  credit: "Crédito",
  checking: "Débito",
  savings: "Débito",
  cash: "Débito",
  credit_card: "Crédito",
  investment: "Débito"
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function getAccountTypeLabel(accountType: AccountType): string {
  return accountTypeLabelMap[accountType];
}

export function formatAccountBalanceFromCents(amountInCents: number): string {
  return currencyFormatter.format(amountInCents / 100);
}
