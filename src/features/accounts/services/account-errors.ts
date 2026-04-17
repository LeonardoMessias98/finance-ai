export class AccountHasTransactionsError extends Error {
  constructor(message = "Essa conta já foi usada em transações e não pode ser excluída.") {
    super(message);
    this.name = "AccountHasTransactionsError";
  }
}
