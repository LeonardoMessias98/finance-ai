export class DuplicateCategoryError extends Error {
  constructor(message = "Já existe uma categoria com esse nome dentro do mesmo tipo.") {
    super(message);
    this.name = "DuplicateCategoryError";
  }
}
