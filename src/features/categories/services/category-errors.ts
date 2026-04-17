export class DuplicateCategoryError extends Error {
  constructor(message = "Já existe uma categoria com esse nome dentro do mesmo tipo.") {
    super(message);
    this.name = "DuplicateCategoryError";
  }
}

export class CategoryHasTransactionsError extends Error {
  constructor(message = "Essa categoria já foi usada em transações e não pode ser excluída.") {
    super(message);
    this.name = "CategoryHasTransactionsError";
  }
}
