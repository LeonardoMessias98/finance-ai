const transactionCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function formatTransactionCurrencyInput(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return transactionCurrencyFormatter.format(0);
  }

  return transactionCurrencyFormatter.format(value);
}

export function parseTransactionCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) {
    return 0;
  }

  return Number(digits) / 100;
}
