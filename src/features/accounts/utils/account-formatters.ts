import type { AccountType } from "@/features/accounts/types/account";

const accountTypeLabelMap: Record<AccountType, string> = {
  checking: "Conta corrente",
  savings: "Poupança",
  cash: "Dinheiro",
  credit_card: "Cartão de crédito",
  investment: "Investimento"
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
